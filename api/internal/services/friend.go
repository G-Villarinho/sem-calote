package services

import (
	"context"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

type FriendService interface {
	CreateFriend(ctx context.Context, friend *models.Friend) (*models.FriendResponse, error)
	GetAllFriends(ctx context.Context) ([]models.FriendResponse, error)
	GetFriendByID(ctx context.Context, id string) (*models.Friend, error)
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
