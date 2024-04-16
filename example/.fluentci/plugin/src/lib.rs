use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };

    let stdout = dag()
        .pkgx()?
        .with_exec(vec!["pkgx", "install", &format!("grype@{}", version)])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn scan(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["grype"])?
        .with_exec(vec!["grype", &args])?
        .stdout()?;
    Ok(stdout)
}
