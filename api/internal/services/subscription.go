package services

import (
	"context"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

type SubscriptionService interface {
	CreateSubscription(ctx context.Context, subscription *models.Subscription) (*models.SubscriptionResponse, error)
	GetAllSubscriptions(ctx context.Context) ([]models.SubscriptionResponse, error)
}

type subscriptionService struct {
	sr repositories.SubscriptionRepository
}

func NewSubscriptionService(
	subscriptionsRepository repositories.SubscriptionRepository) SubscriptionService {
	return &subscriptionService{
		sr: subscriptionsRepository,
	}
}

func (s *subscriptionService) CreateSubscription(ctx context.Context, subscription *models.Subscription) (*models.SubscriptionResponse, error) {
	if err := s.sr.CreateSubscription(ctx, subscription); err != nil {
		return nil, err
	}

	return subscription.ToSubscriptionResponse(), nil
}

func (s *subscriptionService) GetAllSubscriptions(ctx context.Context) ([]models.SubscriptionResponse, error) {
	subscriptions, err := s.sr.GetAllSubscriptions(ctx)
	if err != nil {
		return nil, err
	}

	var subscriptionsResponse = make([]models.SubscriptionResponse, 0, len(subscriptions))
	for i, subscription := range subscriptions {
		subscriptionsResponse[i] = *subscription.ToSubscriptionResponse()
	}

	return subscriptionsResponse, nil
}
