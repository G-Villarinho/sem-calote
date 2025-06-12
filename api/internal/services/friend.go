package services

import (
	"context"
	"fmt"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
	"github.com/g-villarinho/sem-calote/api/pkgs"
)

type FriendService interface {
	CreateFriend(ctx context.Context, friend *models.Friend) (*models.FriendResponse, error)
	GetAllFriends(ctx context.Context) ([]models.FriendResponse, error)
	GetFriendByID(ctx context.Context, id string) (*models.Friend, error)
	DeleteFriendByID(ctx context.Context, id string) error
	UpdateFriend(ctx context.Context, friendID string, friend *models.Friend) (*models.FriendResponse, error)
}

type friendService struct {
	friendRepo repositories.FriendRepository
}

func NewFriendService(
	friendRepo repositories.FriendRepository) FriendService {
	return &friendService{
		friendRepo: friendRepo,
	}
}

func (f *friendService) CreateFriend(ctx context.Context, friend *models.Friend) (*models.FriendResponse, error) {
	friendFromEmail, err := f.friendRepo.GetFriendByEmail(ctx, friend.Email)
	if err != nil {
		return nil, err
	}

	if friendFromEmail != nil {
		return nil, models.ErrAlreadyExists
	}

	if err := f.friendRepo.CreateFriend(ctx, friend); err != nil {
		return nil, err
	}

	return friend.ToFriendResponse(), nil
}

func (f *friendService) GetAllFriends(ctx context.Context) ([]models.FriendResponse, error) {
	friends, err := f.friendRepo.GetAllFriends(ctx)
	if err != nil {
		return nil, err
	}

	var friendsResponse = make([]models.FriendResponse, 0, len(friends))
	for _, friend := range friends {
		friendsResponse = append(friendsResponse, *friend.ToFriendResponse())
	}

	return friendsResponse, nil
}

func (f *friendService) GetFriendByID(ctx context.Context, id string) (*models.Friend, error) {
	friend, err := f.friendRepo.GetFriendByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if friend == nil {
		return nil, models.ErrNotFound
	}

	return friend, nil
}

func (f *friendService) DeleteFriendByID(ctx context.Context, id string) error {
	err := f.friendRepo.DeleteFriendByID(ctx, id)
	if err != nil {
		if err == models.ErrNotFound {
			return models.ErrFriendNotFound
		}

		return err
	}

	return nil
}

func (f *friendService) UpdateFriend(ctx context.Context, friendID string, friend *models.Friend) (*models.FriendResponse, error) {
	existingFriend, err := f.friendRepo.GetFriendByID(ctx, friendID)
	if err != nil {
		return nil, err
	}

	if existingFriend == nil {
		return nil, models.ErrFriendNotFound
	}

	if existingFriend.Email != friend.Email {
		friendFromEmail, err := f.friendRepo.GetFriendByEmail(ctx, friend.Email)
		if err != nil {
			return nil, err
		}

		if friendFromEmail != nil {
			return nil, models.ErrAlreadyExists
		}
	}

	id, err := pkgs.ParseStringToUUID(friendID)
	if err != nil {
		return nil, fmt.Errorf("parse UUID %s: %w", friendID, err)
	}

	friend.ID = id

	if err := f.friendRepo.UpdateFriend(ctx, friend); err != nil {
		return nil, err
	}

	return friend.ToFriendResponse(), nil
}
