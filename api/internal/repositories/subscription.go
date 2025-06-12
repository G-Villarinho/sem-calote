package repositories

import (
	"context"
	"errors"
	"time"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SubscriptionRepository interface {
	CreateSubscription(ctx context.Context, subscription *models.Subscription) error
	GetAllSubscriptions(ctx context.Context, withFriends bool) ([]models.Subscription, error)
	GetSubscriptionByID(ctx context.Context, id string, withFriends bool) (*models.Subscription, error)
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

func (r *subscriptionRepository) GetAllSubscriptions(ctx context.Context, withFriends bool) ([]models.Subscription, error) {
	var subscriptions []models.Subscription

	query := r.db.WithContext(ctx)

	if withFriends {
		query = query.Preload("Friends")
	}

	err := query.Find(&subscriptions).Error
	if err != nil {
		return nil, err
	}

	return subscriptions, nil
}

func (r *subscriptionRepository) GetSubscriptionByID(ctx context.Context, id string, withFriends bool) (*models.Subscription, error) {
	var subscription models.Subscription

	query := r.db.WithContext(ctx)

	if withFriends {
		query = query.Preload("Friends")
	}

	err := query.Where("id = ?", id).First(&subscription).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &subscription, nil
}

func (r *subscriptionRepository) GetSubscriptionByIDWithFriends(ctx context.Context, id string) (*models.Subscription, error) {
	var subscription models.Subscription

	err := r.db.WithContext(ctx).
		Preload("Friends").
		First(&subscription, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &subscription, nil
}
