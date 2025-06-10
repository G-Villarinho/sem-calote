package config

import (
	"fmt"

	"github.com/Netflix/go-env"
	"github.com/joho/godotenv"
)

var (
	EnvDevelopment = "development"
	EnvStaging     = "staging"
	EnvProduction  = "production"
)

var Env Environment

func LoadEnvironment() error {
	if err := godotenv.Load(); err != nil {
		return fmt.Errorf("load env: %w", err)
	}

	_, err := env.UnmarshalFromEnviron(&Env)
	if err != nil {
		return fmt.Errorf("unmarshal env: %w", err)
	}

	return nil
}
