package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

type FamilyService interface {
	CreateFamily(ctx context.Context, family *models.Family) error
	DeleteFamily(ctx context.Context, friendID, subscriptionID string) error
}

type familyService struct {
	familyRepo       repositories.FamilyRepository
	friendRepo       repositories.FriendRepository
	subscriptionRepo repositories.SubscriptionRepository
}

func NewFamilyService(
	familyRepo repositories.FamilyRepository,
	friendRepo repositories.FriendRepository,
	subscriptionRepo repositories.SubscriptionRepository) FamilyService {
	return &familyService{
		familyRepo:       familyRepo,
		friendRepo:       friendRepo,
		subscriptionRepo: subscriptionRepo,
	}
}

func (f *familyService) CreateFamily(ctx context.Context, family *models.Family) error {
	friend, err := f.friendRepo.GetFriendByID(ctx, family.FriendID.String())
	if err != nil {
		return fmt.Errorf("get friend by ID %s: %w", family.FriendID.String(), err)
	}

	if friend == nil {
		return models.ErrFriendNotFound
	}

	subscription, err := f.subscriptionRepo.GetSubscriptionByID(ctx, family.SubscriptionID.String(), false)
	if err != nil {
		return fmt.Errorf("get subscription by ID %s: %w", family.SubscriptionID.String(), err)
	}

	if subscription == nil {
		return models.ErrSubscriptionNotFound
	}

	if err := f.familyRepo.CreateFamily(ctx, family); err != nil {
		return fmt.Errorf("create family: %w", err)
	}

	return nil
}

func (f *familyService) DeleteFamily(ctx context.Context, friendID string, subscriptionID string) error {
	err := f.familyRepo.DeleteFamily(ctx, friendID, subscriptionID)
	if err != nil {
		if errors.Is(err, models.ErrNotFound) {
			return models.ErrFamilyAssociationNotFound
		}

		return fmt.Errorf("delete family: %w", err)
	}

	return nil
}
