use rocket::response::{status, status::Custom};
use rocket::http::Status;

use serde::{Serialize, Deserialize};
use serde_json::{Value, json};
use rocket::serde::json::Json;

use diesel::prelude::*;
use diesel::sql_types::*;
use diesel::sql_query;

use crate::global::{is_null_or_whitespace, request_authentication};
use crate::responses::*;
use crate::structs::*;
use crate::tables::*;

use uuid::Uuid;

#[get("/list?<id>")]
pub async fn project_list(params: &Query_string, id: Option<String>) -> Custom<Value> {
    // TODO: THIS ISNT FILTERING BY ID AND ORG.
    // Get internal database information.
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");

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
    
    // Authenticated user.
    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/project/list").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    let mut project_query = project::table
    // .filter(filters.clone())
    .left_join(crate::tables::namespaces::dsl::namespaces.on(crate::tables::namespaces::dsl::id.nullable().eq(crate::tables::project::dsl::namespace.nullable())))
    .left_join(crate::tables::orgs::dsl::orgs.on(crate::tables::orgs::dsl::id.nullable().eq(crate::tables::namespaces::dsl::org.nullable())))
    .select((
        crate::tables::project::all_columns,
        crate::tables::namespaces::all_columns.nullable(),
        crate::tables::orgs::all_columns.nullable(),
    ))
    .into_boxed();

    // TODO: This isn't filtering by orgs the user has access to.
    if (ids.len() > 0) {
        project_query = project_query.filter(crate::tables::project::id.eq_any(ids.clone()))
    }

    let project_result = project_query
    // .limit(100)
    .order(project::created.asc())
    .load::<(Project, Option<Namespace>, Option<Org>)>(&mut *db)
    .expect("Something went wrong querying the DB.");

    let project_public_result: Vec<Project_public> = project_result
    .into_iter()
    .map(|(project, namespace, org)| {
        Project_public::from((project, namespace.unwrap(), org.unwrap()))
    })
    .collect();

    status::Custom(Status::Ok, json!({
        "ok": true,
        "data": project_public_result,
    }))
}