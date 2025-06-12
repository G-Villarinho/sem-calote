package services

import (
	"context"
	"errors"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
	"github.com/g-villarinho/sem-calote/api/pkgs"
)

type SubscriptionService interface {
	CreateSubscription(ctx context.Context, subscription *models.Subscription) (*models.SubscriptionResponse, error)
	GetAllSubscriptions(ctx context.Context, withFriends bool) ([]models.SubscriptionResponse, error)
	GetSubscriptionByID(ctx context.Context, id string, withFriends bool) (*models.SubscriptionResponse, error)
	DeleteSubscriptionByID(ctx context.Context, id string) error
	UpdateSubscription(ctx context.Context, subscriptionId string, subscription *models.Subscription) (*models.SubscriptionResponse, error)
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
	for _, subscription := range subscriptions {
		subscriptionsResponse = append(subscriptionsResponse, *subscription.ToSubscriptionResponse())
	}

	return subscriptionsResponse, nil
}

func (s *subscriptionService) GetSubscriptionByID(ctx context.Context, id string, withFriends bool) (*models.SubscriptionResponse, error) {
	subscription, err := s.subscriptionRepo.GetSubscriptionByID(ctx, id, withFriends)
	if err != nil {
		return nil, err
	}

	if subscription == nil {
		return nil, models.ErrSubscriptionNotFound
	}

	return subscription.ToSubscriptionResponse(), nil
}

func (s *subscriptionService) DeleteSubscriptionByID(ctx context.Context, id string) error {
	if err := s.subscriptionRepo.DeleteSubscriptionByID(ctx, id); err != nil {
		if errors.Is(err, models.ErrNotFound) {
			return models.ErrSubscriptionNotFound
		}
		return err
	}

	return nil
}

func (s *subscriptionService) UpdateSubscription(ctx context.Context, subscriptionId string, subscription *models.Subscription) (*models.SubscriptionResponse, error) {
	id, err := pkgs.ParseStringToUUID(subscriptionId)
	if err != nil {
		return nil, err
	}

	subscription.ID = id

	if err := s.subscriptionRepo.UpdateSubscription(ctx, subscription); err != nil {
		if errors.Is(err, models.ErrNotFound) {
			return nil, models.ErrSubscriptionNotFound
		}

		return nil, err
	}

	return subscription.ToSubscriptionResponse(), nil
}
