package services

import (
	"context"
	"fmt"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

type FamilyService interface {
	AddFamilyMembers(ctx context.Context, families []*models.Family) error
	RemoveFamilyMembers(ctx context.Context, subscriptionID string, friendIDs []string) error
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

func (f *familyService) AddFamilyMembers(ctx context.Context, families []*models.Family) error {
	if len(families) == 0 {
		return nil
	}

	subscriptionID := families[0].SubscriptionID.String()
	subscription, err := f.subscriptionRepo.GetSubscriptionByID(ctx, subscriptionID, false)
	if err != nil {
		return fmt.Errorf("get subscription by ID %s: %w", subscriptionID, err)
	}

	if subscription == nil {
		return models.ErrSubscriptionNotFound
	}

	for _, family := range families {
		friend, err := f.friendRepo.GetFriendByID(ctx, family.FriendID.String())
		if err != nil {
			return fmt.Errorf("get friend by ID %s: %w", family.FriendID.String(), err)
		}

		if friend == nil {
			return fmt.Errorf("friend with id %s not found: %w", family.FriendID.String(), models.ErrFriendNotFound)
		}
	}

	if err := f.familyRepo.CreateFamilies(ctx, families); err != nil {
		return fmt.Errorf("create families batch: %w", err)
	}

	return nil
}

func (f *familyService) RemoveFamilyMembers(ctx context.Context, subscriptionID string, friendIDs []string) error {
	if len(friendIDs) == 0 {
		return nil
	}

	if err := f.familyRepo.DeleteFamilies(ctx, subscriptionID, friendIDs); err != nil {
		return fmt.Errorf("remove family members: %w", err)
	}

	return nil
}
