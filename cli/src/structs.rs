use std::collections::HashMap;

use serde::{Serialize, Deserialize};
use serde_json::{Value, json};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Config {
    pub stages: HashMap<String, Test_stage>,
    pub env: Option<HashMap<String, String>>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Config_install {
    pub database: Option<Config_install_database>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Config_install_database {
    pub username: Option<String>,
    pub password: Option<String>,
    pub port: Option<u64>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Test_stage {
    pub commands: Option<Vec<Test_command>>,
    // pub database: Option<Config_install_database>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Test_command {
    pub name: String,
    pub run: Option<Test_command_run>,
    pub env: Option<Test_env>,
    pub request: Option<Command_request>,
    pub health_check: Option<Command_healthcheck>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Test_command_run {
    pub cmd: String,
    pub status: Option<i32>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Test_env {
    pub key: String,
    pub value: String
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Command_argument {
    pub value: String
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(untagged)]
pub enum Body {
    Text(String),
    Json(Value)
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Command_request {
    pub method: Option<String>,
    pub url: Option<String>,
    #[serde(rename = "content-type")]
    pub content_type: Option<String>,
    pub params: Option<Value>,
    pub body: Option<Body>,
    pub headers: Option<HashMap<String, String>>,
    pub _loop: Option<bool>,
    pub timeout: Option<u64>,
    pub response: Option<Command_request_response>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Command_request_response {
    pub status_code: Option<u16>,
    pub body: Option<HashMap<String, Command_request_response_variable_enum>>, // Allows 1 key or multi-depth keys. E.g. specifying .key, .key.cool.mine
    pub cookie: Option<HashMap<String, Command_request_response_cookie>>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(untagged)]
pub enum Command_request_response_variable_enum {
    Key(HashMap<String, Command_request_response_variable>),
    Response(Command_request_response_variable)
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Command_request_response_variable {
    pub _type: Option<String>,
    pub nullable: Option<bool>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Command_request_response_cookie {
    pub _type: Option<String>,
    pub nullable: Option<bool>,
    pub env: Option<String>
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Command_healthcheck {
    pub method: Option<String>,
    pub url: Option<String>,
    #[serde(rename = "content-type")]
    pub _loop: Option<bool>,
    pub timeout: Option<u64>
}