use crate::structs::*;

use serde::{Serialize, Deserialize};
use serde_json::json;

use std::fs;
use std::collections::HashMap;
use std::process::Command;

use yaml_rust::{Yaml, YamlLoader, YamlEmitter};

pub async fn parse_yaml(arguments: HashMap<String, Command_argument>, file_path: Option<&str>, yaml_string: Option<&str>) -> Config {
    // let contents = fs::read_to_string(file_path).expect("Should have been able to read the file");
    if (file_path.is_none() == true && yaml_string.is_none() == true) {
        panic!("Missing both file_path and yaml_string");
    }
    
    let file_contents = &fs::read_to_string(file_path.unwrap()).expect("Could not read file");
    let input = yaml_string.unwrap_or(file_contents);
    println!("Input {}", input);
    let cfg: Config = serde_yaml::from_str(input).expect("Failed to parse yaml");
    for (name, stage) in &cfg.stages {
        println!("Stage {name}: {stage:?}");
    }
    return cfg;
}

pub async fn run(arguments: HashMap<String, Command_argument>) {
    let file_path: String = arguments.get("file").unwrap().value.clone();
    
    let config = parse_yaml(arguments.clone(), Some(&file_path), None).await;
    let config_env = &config.env.clone().unwrap();

    let stages = config.stages;

    for (stage_name, stage) in stages {
        for command in stage.commands.unwrap() {
            // println!("run: {:?}", command.run);
            // println!("run: {:?}", command.env);

            println!("Running {} in {}", command.name, stage_name);

            let mut envs: HashMap<String, String> = HashMap::new();

            for (key, value) in config_env {
                envs.insert(key.clone(), value.clone());
            }

            if (command.request.is_some()) {
                crate::stage_handler::request::send(command.request.unwrap()).await;
            } else if (command.health_check.is_some()) {
                crate::stage_handler::health_check::send(command.health_check.unwrap()).await;
            } else if (command.run.is_none() == false) {
                let run = command.run.unwrap();

                let cmd = Command::new("sh")
                .envs(envs.clone())
                .arg("-c")
                .arg(run.cmd)
                .output()
                .expect("failed to execute process");

                let output = String::from_utf8(cmd.stdout).unwrap_or("No output".to_string());
                println!("OUTPUT: {}", output);
                if (cmd.status.code().unwrap() != run.status.unwrap_or(2)) {
                    panic!("Status code ({}) is not the expected {}. [{}] [{}]: {}", cmd.status.code().unwrap(), run.status.unwrap_or(0), stage_name, command.name, output);
                }
            }
        }
    }
}