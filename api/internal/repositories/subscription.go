package repositories

import (
	"context"
	"time"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SubscriptionRepository interface {
	CreateSubscription(ctx context.Context, subscription *models.Subscription) error
	GetAllSubscriptions(ctx context.Context) ([]models.Subscription, error)
	GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error)
}

type subscriptionRepository struct {
	db *gorm.DB
}

func NewSubscriptionRepository(db *gorm.DB) SubscriptionRepository {
	return &subscriptionRepository{
		db: db,
	}
}

func (r *subscriptionRepository) CreateSubscription(ctx context.Context, subscription *models.Subscription) error {
	id, err := uuid.NewRandom()
	if err != nil {
		return err
	}

	subscription.ID = id
	subscription.CreatedAt = time.Now().UTC()

	if err := r.db.WithContext(ctx).Create(subscription).Error; err != nil {
		return err
	}

	return nil
}

func (r *subscriptionRepository) GetAllSubscriptions(ctx context.Context) ([]models.Subscription, error) {
	var subscriptions []models.Subscription
	if err := r.db.WithContext(ctx).Find(&subscriptions).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}

		return nil, err
	}

	return subscriptions, nil
}

func (r *subscriptionRepository) GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error) {
	var subscription models.Subscription
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&subscription).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}

		return nil, err
	}

	return &subscription, nil
}
