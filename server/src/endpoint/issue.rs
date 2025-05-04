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

use crate::global::{ generate_random_id, is_null_or_whitespace, request_authentication };
use crate::responses::*;
use crate::structs::*;
use crate::tables::*;

#[get("/list?<ids>&<me>&<authenticator_pathname>")]
pub async fn issue_list(ids: Option<String>, me: Option<bool>, authenticator_pathname: Option<String>, params: &Query_string) -> Custom<Value> {
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");
    // TODO: This should have a dedicated function like video_get.

    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/issue/list").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };
    let account_id = Some(request_authentication_output.account_id.clone());

    let id: Vec<String> = match ids {
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

    let mut using_ids = false;
    if (id.len() > 0) {
        using_ids = true;
    }
    if (id.len() > 100) {
        return status::Custom(Status::BadRequest, not_found("params.ids cannot be longer than 100."));
    }
    println!("id.len(): {}", id.len());

    let mut query = crate::tables::issue::table
    .left_join(crate::tables::project::table.on(crate::tables::issue::project.nullable().eq(crate::tables::project::id.nullable())))
    .left_join(crate::tables::namespaces::table.on(crate::tables::namespaces::id.nullable().eq(crate::tables::project::namespace.nullable())))
    .left_join(crate::tables::orgs::table.on(crate::tables::orgs::id.nullable().eq(crate::tables::namespaces::org.nullable())))
    .select((crate::tables::issue::all_columns, crate::tables::project::all_columns.nullable(), crate::tables::namespaces::all_columns.nullable(), crate::tables::orgs::all_columns.nullable()))
    .into_boxed();
    
    // TODO: NEED TO FILTER BY PROJECT_ID HERE.
    if (id.len() > 0) {
        query = query.filter(crate::tables::issue::id.eq_any(id.clone()))
    }

    // if (is_using_get_me == true) {
    //     query = query.filter(crate::tables::profiles::id.eq(profile_id.clone().unwrap()))
    // }

    let results = query
    .limit(100)
    .load::<(Issue, Option<Project>, Option<Namespace>, Option<Org>)>(&mut db)
    .expect("Video db query failed");

    let mut found: Vec<String> = Vec::new();
    let mut issues: Vec<Value> = Vec::new();
    for (issue, project_option, namespace_option, org_option) in results {
        // if (project_option.is_none() == true || namespace_option.is_none() == true || org_option.is_none() == true) {
        //     // TODO: This should maybe indicator a failure or push to the issue not found array. profile_option being checked is still important.
        //     return status::Custom(Status::NotFound, not_found("Issue not found."));
        // }

        let issue_public: Issue_public = (issue.clone(), project_option.unwrap(), namespace_option.unwrap(), org_option.unwrap()).into();
        found.push(issue.id.clone());
        issues.push(json!(issue_public));
    }

    if (using_ids == true) {
        let not_found: Vec<String> = id.iter()
        .filter(|item| {
            let contains = found.contains(item);
            !contains
        })
        .cloned()
        .collect();

        for id in not_found {
            issues.push(json!({
                "error": true,
                "not_found": true,
                "message": "Issue not found.",
                "issue_id": id
            }));
        }
    }
    
    status::Custom(Status::Ok, json!({
        "ok": true,
        "data": issues
    }))
}

#[post("/update", format = "application/json", data = "<body>")]
pub async fn issue_update(params: &Query_string, mut body: Json<Issue_update_body>) -> Custom<Value> {
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");

    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/issue/update").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    let actions = body.actions.clone().unwrap();

    for data in actions.clone() {
        // Normallly it would matter what the value of unwrap_or was here, since we're trying to check the original value, in this case checking if it's None, but it doesn't matter here because there is a check for 'create' or 'update'.
        let action = data.action.clone().unwrap_or(String::new());
        if (action != "create" && action != "update") {
            return status::Custom(Status::BadRequest, error_message("invalid_value", "body.action must be create/update."));
        }

        // TODO: Accept issue data as an event as add it to this issue. Most likely best to do this when handling incoming events.
        if (action == "create") {

        } else if (action == "update") {
            let issue_id = data.id.clone().expect("missing body.id");
            let device_check: Option<Issue> = issue::table
            .filter(issue::id.eq(issue_id.clone()))
            .first(&mut db)
            .optional()
            .expect("Something went wrong querying the DB.");
        }
    };

    for data in actions.clone() {
    };

    return status::Custom(Status::Ok, json!({
        "ok": true
    }));
}