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
	fr repositories.FriendRepository
}

func NewFriendService(
	fr repositories.FriendRepository) FriendService {
	return &friendService{
		fr: fr,
	}
}

func (f *friendService) CreateFriend(ctx context.Context, friend *models.Friend) (*models.FriendResponse, error) {
	friendFromEmail, err := f.fr.GetFriendByEmail(ctx, friend.Email)
	if err != nil {
		return nil, err
	}

	if friendFromEmail != nil {
		return nil, models.ErrAlreadyExists
	}

	if err := f.fr.CreateFriend(ctx, friend); err != nil {
		return nil, err
	}

	return friend.ToFriendResponse(), nil
}

func (f *friendService) GetAllFriends(ctx context.Context) ([]models.FriendResponse, error) {
	friends, err := f.fr.GetAllFriends(ctx)
	if err != nil {
		return nil, err
	}

	var friendsResponse = make([]models.FriendResponse, 0, len(friends))
	for i, friend := range friends {
		friendsResponse[i] = *friend.ToFriendResponse()
	}

	return friendsResponse, nil
}

func (f *friendService) GetFriendByID(ctx context.Context, id string) (*models.Friend, error) {
	friend, err := f.fr.GetFriendByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if friend == nil {
		return nil, models.ErrNotFound
	}

	return friend, nil
}
