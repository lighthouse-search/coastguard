use rocket::response::{status, status::Custom};
use rocket::http::Status;

use serde::{Serialize, Deserialize};
use serde_json::{Value, json};
use rocket::serde::json::Json;

use diesel::prelude::*;
use diesel::sql_types::*;
use diesel::sql_query;

use crate::global::request_authentication;
use crate::responses::*;
use crate::structs::*;
use crate::tables::*;
use crate::SQL_TABLES;

#[get("/list")]
pub async fn process_list(params: &Query_string) -> Custom<Value> {
    // Get internal database information.
    let mut db = crate::DB_POOL.get().expect("Failed to get a connection from the pool.");
    let sql: Config_sql = (&*SQL_TABLES).clone();

    // Authenticated user.
    let request_authentication_output: Request_authentication_output = match request_authentication(None, params, "/process/list").await {
        Ok(data) => data,
        Err(e) => return status::Custom(Status::Unauthorized, not_authorized())
    };

    // Query rover_processes, rover_devices and rover_users tables.
    let process_result: Vec<(Rover_processes, Option<Rover_devices>, Option<Rover_users>)> = rover_processes::table
    .left_join(crate::tables::rover_devices::dsl::rover_devices.on(crate::tables::rover_devices::dsl::id.nullable().eq(crate::tables::rover_processes::dsl::device_id.nullable()))) // LEFT JOIN rover_devices ON rover_devices.id=rover_processes.device_id
    .left_join(crate::tables::rover_users::dsl::rover_users.on(crate::tables::rover_users::dsl::id.nullable().eq(crate::tables::rover_devices::dsl::user_id.nullable()))) // LEFT JOIN rover_users ON rover_users.id=rover_devices.user_id
    .order(rover_processes::created.asc())
    .select((
        rover_processes::all_columns,
        rover_devices::all_columns.nullable(),
        rover_users::all_columns.nullable(),
    ))
    .load::<(Rover_processes, Option<Rover_devices>, Option<Rover_users>)>(&mut *db)
    .expect("Something went wrong querying the DB.");

    // Loop through data to only return relevant data (e.g ensuring data is correct and consistent)
    let mut process_public: Vec<Rover_processes_data_for_admins> = process_result
    .into_iter()
    .map(Rover_processes_data_for_admins::from)
    .collect();

    // Return results to client.
    status::Custom(Status::Ok, json!({
        "ok": true,
        "data": process_public
    }))
}