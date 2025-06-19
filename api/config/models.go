package config

type Environment struct {
	Env         string `env:"ENV,default=development"`
	API         API
	Sqlite      Sqlite
	Hermes      Hermes
	MercadoPago MercadoPago
	Pix         Pix
}

type API struct {
	Port         int      `env:"API_PORT,default=8080"`
	AllowOrigins []string `env:"API_ALLOW_ORIGINS"`
	BaseURL      string   `env:"API_BASE_URL,default=http://localhost:8080"`
}

type Hermes struct {
	APIKey string `env:"HERMES_MAILER_API_KEY"`
	APIURL string `env:"HERMES_MAILER_API_URL"`
}

type Sqlite struct {
	Database    string `env:"SQLITE_DATABASE,default=./db.sqlite"`
	MaxConns    int    `env:"SQLITE_MAX_CONNS,default=10"`
	MaxIdle     int    `env:"SQLITE_MAX_IDLE,default=5"`
	MaxLifeTime int    `env:"SQLITE_MAX_LIFE_TIME,default=3600"` // in seconds
	Timeout     int    `env:"SQLITE_TIMEOUT,default=5"`          // in seconds
}

type MercadoPago struct {
	PublicKey        string  `env:"MERCADO_PAGO_PUBLIC_KEY"`
	AccessToken      string  `env:"MERCADO_PAGO_ACCESS_TOKEN"`
	BaseURL          string  `env:"MERCADO_PAGO_BASE_URL"`
	SuccessBackURL   string  `env:"MERCADO_PAGO_SUCCESS_BACK_URL"`
	FailureBackURL   string  `env:"MERCADO_PAGO_FAILURE_BACK_URL"`
	PixFeePercentage float64 `env:"MERCADO_PAGO_PIX_FEE_PERCENTAGE,default=0.99"`
}

type Pix struct {
	Key string `env:"PIX_KEY"`
}
