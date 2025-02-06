use rocket::form::validate::Contains;
use rocket::response::{Debug, status::Created};
use rocket::response::status;
use rocket::http::Status;
use rocket::response::status::Custom;

use serde::{Serialize, Deserialize};
use serde_json::{Value, json};
use rocket::serde::json::Json;

use diesel::prelude::*;
use diesel::sql_types::*;
use diesel::sql_query;

use elasticsearch::{BulkOperation, BulkParts, SearchParts};

use crate::database::elasticsearch_parse_response;
use crate::global::{ generate_random_id, is_null_or_whitespace, request_authentication };
use crate::responses::*;
use crate::structs::*;
use crate::tables::*;
use crate::ES;

use uuid::Uuid;

#[get("/list?<id>&<me>&<authenticator_pathname>&<filter>")]
pub async fn event_list(id: Option<String>, me: Option<bool>, authenticator_pathname: Option<String>, filter: Option<String>, params: &Query_string) -> Custom<Value> {
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");
    // TODO: This should have a dedicated function like video_get.

    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/event/list").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    let ids: Vec<String> = match id {
        Some(id_string) => {
            if (is_null_or_whitespace(Some(id_string.clone())) == true) {
                Vec::new()
            } else {
                // Split by commas if it's a list, or use as a single item
                id_string.split(',').map(|s| s.trim().to_string()).collect()
            }
        }
        None => Vec::new(), // No `id` provided
    };
    if (ids.len() > 100) {
        return status::Custom(Status::BadRequest, not_found("params.ids cannot be longer than 100."));
    }

    // TODO: We need to add filters for specific things here, like error ids.

    let mut must: Vec<Value> = vec![json!({
        "term": json!({
            "project_id.keyword": request_authentication_output.project_id,
        })
    })];
    let mut aggs: Option<Value> = None;

    if (ids.len() > 0) {
        must.push(json!({
            "term": json!({
                "ids": ids
            })
        }));
    }


    let mut user_rating_output: Option<Vec<User_rating_item>> = None;
    // let mut discussion_output: Option<std::collections::HashMap<String, i64>> = None;
    let _source: Vec<&str> = vec!["type", "project_id", "nonce", "nonce_hash", "alias", "content", "metadata", "tags", "created"];

    // TODO: Add permissions, some users won't be able to access things like error events.
    if (filter.is_none() == false) {
        let filter_unwrapped: Event_list_filter = serde_json::from_str(&filter.unwrap()).expect("Failed to parse filter.");
        
        // TODO: Might be a good idea to run a type check here.
        if (filter_unwrapped.r#type.is_none() == false) {
            must.push(json!({
                "terms": json!({
                    "type.keyword": filter_unwrapped.r#type.unwrap()
                })
            }));
        }

        if (filter_unwrapped.nonce.is_none() == false) {
            must.push(json!({
                "terms": json!({
                    "nonce.keyword": filter_unwrapped.nonce.unwrap()
                })
            }));
        }

        if (filter_unwrapped.nonce_hash.is_none() == false) {
            must.push(json!({
                "terms": json!({
                    "nonce_hash.keyword": filter_unwrapped.nonce_hash.unwrap()
                })
            }));
        }

        if (filter_unwrapped.created_before.is_none() == false || filter_unwrapped.created_after.is_none() == false) {
            must.push(json!({
                "range": json!({
                    "created.keyword": json!({
                        "gte": filter_unwrapped.created_before.unwrap(),
                        "lte": filter_unwrapped.created_after.unwrap(),
                    })
                })
            }));
        }

        if (filter_unwrapped.distinct.unwrap_or(false) == true) {
            aggs = Some(json!({
                "unique_nonce_hashes": {
                    "terms": {
                        "field": "nonce_hash.keyword", 
                        "size": 10000 
                    },
                    "aggs": {
                        "latest_record": {
                            "top_hits": {
                                "size": 1,
                                "sort": [
                                    { "created": { "order": "desc" } }
                                ],
                                "_source": _source
                            }
                        }
                    }
                }
            }));
        }

        // if (filter_unwrapped.user_rating.unwrap_or(false) == true) {
        //     let (user_rating_db, user_rating_counts_map) = crate::globals::user_rating::get(db, ids, request_authentication_output.project_id.clone()).await;
        //     db = user_rating_db;

        //     user_rating_output = Some(user_rating_counts_map);
        // }

        // if (filter_unwrapped.discussion.unwrap_or(false) == true) {
        //     let (db_discussion, discussions_public, discussion_counts_map, discussions_distinct_authors_public) = crate::globals::discussion::get(db, format!("events-{}", ), request_authentication_output.project_id).await;
        //     db = db_discussion;

        //     discussion = Some(json!({
        //         "data": discussions_public,
        //         "total": discussion_counts_map,
        //         "authors": discussions_distinct_authors_public
        //     }));
        // }
    }

    let mut query: Value = json!({
        "track_total_hits": true,
        "sort": [
            { "created": { "order": "desc" } }
        ],
        "query": {
            "bool": {
                "must": must
            },
        },
        "_source": _source
    });
    if (aggs.is_none() == false) {
        query["aggs"] = aggs.clone().unwrap();
    }

    let response = ES
    .search(SearchParts::Index(&["coastguard-events"]))
    .from(0)
    .body(query)
    .send()
    .await.expect("Failed to query ElasticSearch");

    let response_body = response.json::<Value>().await.expect("Failed to parse response.");

    if (aggs.is_none() == false) {
        println!("{}", response_body.clone()["aggregations"]["unique_nonce_hashes"]["buckets"]);
        let mut results: Vec<Value> = Vec::new();
        if let Some(buckets) = response_body["aggregations"]["unique_nonce_hashes"]["buckets"].as_array() {
            for bucket in buckets {
                if let Some(latest_record) = bucket["latest_record"]["hits"]["hits"][0]["_source"].as_object() {
                    results.push(json!(latest_record));
                }
            }
        }

        status::Custom(Status::Ok, json!({
            "ok": true,
            "data": results,
            "user_rating": user_rating_output,
            "total": Option::<i64>::None
        }))
    } else {
        let total_hits = response_body["hits"]["total"]["value"].as_i64().unwrap_or(0);

        status::Custom(Status::Ok, json!({
            "ok": true,
            "data": elasticsearch_parse_response(response_body),
            "user_rating": user_rating_output,
            "total": total_hits
        }))
    }
}

#[post("/create", format = "application/json", data = "<body>")]
pub async fn event_create(params: &Query_string, mut body: Json<Event_update_body>) -> Custom<Value> {
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");

    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/event/create").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    if (body.actions.is_none() == true) {
        return status::Custom(Status::BadRequest, error_message("null_or_whitespace", "body.actions is null or whitespace."));
    }
    let actions = body.actions.clone().unwrap();

    for data in actions.clone() {
        // TODO: move these into an array and return errors after the validation look finishes, in bulk.
        if (is_null_or_whitespace(data.r#type.clone()) == true) {
            return status::Custom(Status::BadRequest, error_message("null_or_whitespace", "body.type is null or whitespace."));
        }
        let r#type = data.r#type.unwrap();

        let allowed_types: Vec<String> = vec!["error".to_string(), "request".to_string()];
        if (!allowed_types.contains(r#type)) {
            return status::Custom(Status::BadRequest, error_message("invalid_value", &format!("body.type must be either: {}", allowed_types.join(", "))));
        }

        if (is_null_or_whitespace(data.nonce.clone()) == true) {
            return status::Custom(Status::BadRequest, error_message("null_or_whitespace", "body.nonce is null or whitespace."));
        }
        if (is_null_or_whitespace(data.content.clone()) == true) {
            return status::Custom(Status::BadRequest, error_message("null_or_whitespace", "body.content is null or whitespace."));
        }
    };

    let mut ops: Vec<BulkOperation<Value>> = Vec::with_capacity(actions.len());

    // TODO: Need to do a large select and check if there are existing errors with provided nonce, get their error IDs, and add those error ids (or create a new id and add those) ids to the error data under the "event_id" key.
    // REMEMBER: THIS IS AN EVENT ENDPOINT. NOT AN ERROR ENDPOINT. WE JUST HAPPEN TO BE DOING SOME ERROR PROCESSING UNDER IT. EVENTS ARE THEIR OWN FIREHOSE COMPONENT THAT CAN BE USED FOR LOTS OF THINGS.

    for data in actions.clone() {
        let project_id = request_authentication_output.project_id.clone();

        let r#type: String = data.r#type.clone().expect("missing body.type");
        let nonce: String = data.nonce.clone().expect("missing body.nonce");
        let nonce_hash: String = crate::security::hash(&data.nonce.clone().expect("missing body.nonce"), None);
        
        let alias: Option<String> = data.alias.clone();
        let content: String = data.content.clone().expect("missing body.content");

        let metadata: Value = data.metadata.unwrap_or(json!({}));
        let tags: Vec<Value> = data.tags.unwrap_or(Vec::new());

        let created: i64 = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis().try_into().unwrap();

        ops.push(
            BulkOperation::create(json!({
                "type": r#type,
                "project_id": project_id,
                "nonce": nonce,
                "nonce_hash": nonce_hash,
                "alias": alias,
                "content": content,
                "metadata": metadata,
                "tags": tags,
                "created": created
            })
        )
        .id(Uuid::new_v4().to_string())
        // .pipeline("process_tweet")
        .into());
    };

    // Add bulk event data to elasticsearch.
    ES
    .bulk(BulkParts::Index("coastguard-events"))
    .body(ops)
    .send()
    .await.expect("Failed to insert data.");

    return status::Custom(Status::Ok, json!({
        "ok": true
    }));
}