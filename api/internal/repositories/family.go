package repositories

import (
	"context"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type FamilyRepository interface {
	CreateFamily(ctx context.Context, family *models.Family) error
	DeleteFamily(ctx context.Context, friendID, subscriptionID string) error
}

type familyRepository struct {
	db *gorm.DB
}

func NewFamilyRepository(db *gorm.DB) FamilyRepository {
	return &familyRepository{
		db: db,
	}
}

func (r *familyRepository) CreateFamily(ctx context.Context, family *models.Family) error {
	err := r.db.WithContext(ctx).
		Clauses(clause.OnConflict{DoNothing: true}).
		Create(family).Error

	if err != nil {
		return err
	}

	return nil
}

func (r *familyRepository) DeleteFamily(ctx context.Context, friendID, subscriptionID string) error {
	result := r.db.WithContext(ctx).
		Where("friend_id = ? AND subscription_id = ?", friendID, subscriptionID).
		Delete(&models.Family{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return models.ErrNotFound
	}

	return nil
}
