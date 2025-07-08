use std::time::Duration;

use reqwest::header::HeaderMap;

use crate::structs::Command_request;

pub async fn send(request: Command_request) {
    let client = reqwest::Client::new();
    let url = request.url.unwrap();
    if (url.starts_with("https://") == false && url.starts_with("http://") == false) {
        panic!("url must start with https:// or http://");
    }

    let mut req_builder = match request.method.unwrap_or("GET".to_string()).as_str() {
        "GET" => client.get(url),
        "POST" => client.post(url),
        "PUT" => client.put(url),
        "DELETE" => client.delete(url),
        _ => panic!("Invalid request.method, must be \"GET\", \"POST\", \"PUT\", OR \"DELETE\"")
    };

    // Add query params
    if (request.params.is_some()) {
        req_builder = req_builder.query(&request.params);
    }

    // Create request headers.
    let mut header_map = HeaderMap::new();

    // Add admin's headers to request headers.
    if (request.headers.is_some()) {
        for (k, v) in request.headers.unwrap().into_iter() {
            header_map.insert(
                reqwest::header::HeaderName::from_bytes(k.as_bytes()).expect("Invalid header name"),
                reqwest::header::HeaderValue::from_str(&v).expect("Invalid header value"),
            );
        }
    }

    if (request.body.is_some()) {
        if let crate::structs::Body::Json(text) = &request.body.clone().unwrap() {
            println!("USING JSON");
            header_map.insert("Content-Type", reqwest::header::HeaderValue::from_str(&request.content_type.clone().unwrap()).expect("Invalid header value"));
            req_builder =  match request.content_type.unwrap_or("application/json".into()).as_str() {
                "application/json" => req_builder.json(&request.body.unwrap()),
                "application/x-www-form-urlencoded" => req_builder.form(&request.body.unwrap()),
                // "multipart/form-data" => req_builder.form(&request.body.unwrap()),
                // "multipart" => req_builder.multipart(&request.body),
                _ => panic!("body is an object, so content-type must be \"application/json\", \"multipart/form-data\". Use a raw string for other formats.")
            }
        } else if let crate::structs::Body::Text(text) = request.body.clone().unwrap() {
            println!("USING TEXT");
            header_map.insert("Content-Type", reqwest::header::HeaderValue::from_str(&request.content_type.unwrap()).expect("Invalid header value"));
            req_builder = req_builder.body(text);
        } else {
            panic!("Failed to handle body enum");
        }
    }

    println!("{:?}", header_map);

    // Request timeout
    if (request.timeout.is_some()) {
        req_builder = req_builder.timeout(Duration::from_millis(request.timeout.unwrap()));
    }

    let res = req_builder
        .send()
        .await
        .expect("Failed to send request");

    let status = res.status().as_u16();
    let text = res.text().await.expect("failed to parse");

    println!("{}", text);
    
    let response = request.response.unwrap();
    if status != response.status_code.unwrap_or(200) {
        panic!("Status code ({}) is not {}", status, response.status_code.unwrap());
    }
}