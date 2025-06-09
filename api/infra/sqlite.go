package infra

import (
	"context"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func CreateSQLiteConnection(ctx context.Context, dbName string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(dbName), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}
