package services

import (
	"context"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

type SubscriptionService interface {
	CreateSubscription(ctx context.Context, subscription *models.Subscription) (*models.SubscriptionResponse, error)
	GetAllSubscriptions(ctx context.Context, withFriends bool) ([]models.SubscriptionResponse, error)
}

type subscriptionService struct {
	subscriptionRepo repositories.SubscriptionRepository
}

func NewSubscriptionService(
	subscriptionsRepository repositories.SubscriptionRepository) SubscriptionService {
	return &subscriptionService{
		subscriptionRepo: subscriptionsRepository,
	}
}

func (s *subscriptionService) CreateSubscription(ctx context.Context, subscription *models.Subscription) (*models.SubscriptionResponse, error) {
	if err := s.subscriptionRepo.CreateSubscription(ctx, subscription); err != nil {
		return nil, err
	}

	return subscription.ToSubscriptionResponse(), nil
}

func (s *subscriptionService) GetAllSubscriptions(ctx context.Context, withFriends bool) ([]models.SubscriptionResponse, error) {
	subscriptions, err := s.subscriptionRepo.GetAllSubscriptions(ctx, withFriends)
	if err != nil {
		return nil, err
	}

	var subscriptionsResponse = make([]models.SubscriptionResponse, 0, len(subscriptions))
	for i, subscription := range subscriptions {
		subscriptionsResponse[i] = *subscription.ToSubscriptionResponse()
	}

	return subscriptionsResponse, nil
}
