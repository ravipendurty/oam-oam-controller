# Operation and Maintenance (OAM) Controller

This repository contains code artifctes related to an OAM Controller, which
terminats the O-RAN Alliance Interfaces O1 and OpenFronthaul Management Plane.

## Get stated

Update your ubuntu 24.04 system and clone the OAM Controller repository.

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install make
sudo apt install apache2-utils
mkdir -p ~/workspace && cd ~/workspace

## Get an overview of the system
git clone "https://gerrit.o-ran-sc.org/r/oam/oam-controller" && (cd "oam-controller" && mkdir -p `git rev-parse --git-dir`/hooks/ && curl -Lo `git rev-parse --git-dir`/hooks/commit-msg https://gerrit.o-ran-sc.org/r/tools/hooks/commit-msg && chmod +x `git rev-parse --git-dir`/hooks/commit-msg)
cd oam-controller
make system-check
make install
source .venv/bin/activate
```

## Build

// to be updated

## Deploy

// to be updated

## Documentation

The project documentation link is:
https://docs.o-ran-sc.org/projects/o-ran-sc-oam/en/latest/index.html?highlight=Operation%20and%20mainetance

To generate the documentation the project must be cloned and the following
command must be executed:
```
make docs
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Gerrit GitHub Integration Test
This is a test change to explore gerrit to github integration
