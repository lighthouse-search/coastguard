use std::time::Duration;

use reqwest::header::HeaderMap;

use crate::{stage_handler::health_check, structs::{Command_healthcheck, Command_request, Command_request_response}};

pub async fn send(health_check: Command_healthcheck) {
    println!("Sending health check...");
    return crate::stage_handler::request::send(Command_request {
        method: health_check.method,
        url: health_check.url,
        content_type: None,
        params: None,
        body: None,
        headers: None,
        _loop: health_check._loop,
        timeout: health_check.timeout,
        response: Some(Command_request_response {
            status_code: Some(200),
            body: None,
            cookie: None
        })
    }).await;
}