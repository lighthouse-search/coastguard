use rocket::response::{status, status::Custom};
use rocket::http::Status;

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
use crate::SQL_TABLES;

#[get("/list")]
pub async fn user_list(params: &Query_string) -> Custom<Value> {
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");
    let sql: Config_sql = (&*SQL_TABLES).clone();

    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/user/list").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    let user_result: Vec<Rover_users> = sql_query(format!("SELECT id, first_name, last_name, email, permission, suspended, created FROM {} ORDER BY created DESC", sql.user.unwrap()))
    .load::<Rover_users>(&mut db)
    .expect("Something went wrong querying the DB.");

    let mut user_public: Vec<Rover_users_data_for_admins> = user_result
    .into_iter()
    .map(Rover_users_data_for_admins::from)
    .collect();

    status::Custom(Status::Ok, json!({
        "ok": true,
        "data": user_public
    }))
}

#[get("/get?<id>")]
pub async fn user_get(params: &Query_string, id: Option<String>) -> Custom<Value> {
    if (id.is_none() == true) {
        return status::Custom(Status::BadRequest, error_message("params.id is null or whitespace."));
    }

    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");
    let sql: Config_sql = (&*SQL_TABLES).clone();

    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/user/get").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    let user_result: Vec<Rover_users> = sql_query(format!("SELECT id, first_name, last_name, email, permission, suspended, created FROM {} WHERE id=? ORDER BY created DESC", sql.user.unwrap()))
    .bind::<Text, _>(id.unwrap())
    .load::<Rover_users>(&mut db)
    .expect("Something went wrong querying the DB.");

    let mut user_public: Vec<Rover_users_data_for_admins> = user_result
    .into_iter()
    .map(Rover_users_data_for_admins::from)
    .collect();

    status::Custom(Status::Ok, json!({
        "ok": true,
        "data": user_public
    }))
}

#[post("/update", format = "application/json", data = "<body>")]
pub async fn user_update(params: &Query_string, mut body: Json<User_update_body>) -> Custom<Value> {
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");
    let sql: Config_sql = (&*SQL_TABLES).clone();

    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/user/update").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    // block more than 13 characters for admin_permission_flags.

    // TODO: There should be an action logic pipeline.
    
    // Normallly it would matter what the value of unwrap_or was here, since we're trying to check the original value, in this case checking if it's None, but it doesn't matter here because there is a check for 'create' or 'update'.
    let action = body.action.clone().unwrap_or(String::new());
    if (action != "create" && action != "update") {
        return status::Custom(Status::BadRequest, error_message("body.action must be create/update."));
    }
    if (action == "update" && body.id.is_none() == true) {
        return status::Custom(Status::BadRequest, error_message("body.id must be specified when body.action='update'"));
    }
    if (action == "create" && body.id.is_none() == false) {
        return status::Custom(Status::BadRequest, error_message("body.id cannot be specified when body.action='create'"));
    }

    if (is_null_or_whitespace(body.first_name.clone()) == true) {
        return status::Custom(Status::BadRequest, error_message("body.first_name is null or whitespace."));
    }
    if (is_null_or_whitespace(body.last_name.clone()) == true) {
        return status::Custom(Status::BadRequest, error_message("body.last_name is null or whitespace."));
    }
    if (is_null_or_whitespace(body.email.clone()) == true) {
        return status::Custom(Status::BadRequest, error_message("body.email is null or whitespace."));
    }
    if (body.suspended != Some(true) && body.suspended != Some(false)) {
        return status::Custom(Status::BadRequest, error_message("body.suspended must be true/false."));
    }
    if (body.permission.is_none() == true) {
        return status::Custom(Status::BadRequest, error_message("body.permission is null or whitespace."));
    }

    let first_name = body.first_name.clone().expect("missing body.first_name");
    let last_name = body.last_name.clone().expect("missing body.last_name");
    let email = body.email.clone().expect("missing body.email");
    let permission = body.permission.clone().expect("missing body.permission");
    let suspended = body.suspended.clone().expect("missing body.suspended");

    let mut user_id = generate_random_id();

    if (action == "update") {
        // We know 'body.id' exists, because we checked when validating the 'body.action'.
        user_id = body.id.clone().unwrap(); 

        // TODO: this should be a function, such as user_get().
        let user_id_check: Option<Rover_users> = rover_users::table
        .filter(rover_users::id.eq(user_id.clone()))
        .first(&mut db)
        .optional().expect("Something went wrong querying the DB.");

        if (user_id_check.is_none() == true) {
            return status::Custom(Status::BadRequest, error_message(&format!("No user exists with the provided body.id: '{}'", user_id.clone())));
        }

        diesel::update(crate::tables::rover_users::table.filter(crate::tables::rover_users::id.eq(user_id.clone())))
        .set((rover_users::first_name.eq(first_name), rover_users::last_name.eq(last_name), rover_users::email.eq(email), rover_users::permission.eq(permission), rover_users::suspended.eq(suspended)))
        .execute(&mut db).expect("Failed to update");
    } else if (action == "create") {
        // Check if a user with the provided email already exists, we do not want duplicate emails.
        // TODO: this should be a function, such as user_get().
        let user_email_check: Option<Rover_users> = rover_users::table
        .filter(rover_users::email.eq(email.clone()))
        .first(&mut db)
        .optional()
        .expect("Something went wrong querying the DB.");

        if (user_email_check.is_none() == false) {
            return status::Custom(Status::BadRequest, error_message(&format!("'{}' is already a user. Please use a different email address.", email)));
        }
        
        let user_insert = Rover_users {
            id: user_id.clone(),
            first_name: Some(first_name.clone()),
            last_name: Some(last_name.clone()),
            email: Some(email.clone()),
            permission: Some(permission),
            suspended: Some(suspended),
            created: Some(std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis().try_into().unwrap())
        };
        diesel::insert_into(rover_users::table)
        .values(&user_insert)
        .execute(&mut db)
        .expect("fail");
    }

    return status::Custom(Status::Ok, json!({
        "ok": true,
        "user_id": user_id.clone()
    }));
}