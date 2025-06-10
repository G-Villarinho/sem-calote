package infra

import (
	"context"
	"time"

	"github.com/g-villarinho/sem-calote/api/config"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func CreateSQLiteConnection(ctx context.Context) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(config.Env.Sqlite.Database), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxOpenConns(config.Env.Sqlite.MaxConns)
	sqlDB.SetMaxIdleConns(config.Env.Sqlite.MaxIdle)
	sqlDB.SetConnMaxLifetime(time.Duration(config.Env.Sqlite.MaxLifeTime))

	if err := sqlDB.PingContext(ctx); err != nil {
		_ = sqlDB.Close()
		return nil, err
	}

	return db, nil
}
