package models

import (
	"errors"

	"github.com/google/uuid"
)

var (
	ErrFamilyAssociationNotFound = errors.New("family association not found")
)

type Family struct {
	SubscriptionID uuid.UUID
	Subscription   Subscription `gorm:"foreignKey:SubscriptionID;references:ID"`

	FriendID uuid.UUID
	Friend   Friend `gorm:"foreignKey:FriendID;references:ID"`
}

type CreateFamilyPayload struct {
	FriendID uuid.UUID `json:"friend_id" validate:"required,uuid"`
}

func (p *CreateFamilyPayload) ToFamily(subscriptionID string) (*Family, error) {
	subID, err := uuid.Parse(subscriptionID)
	if err != nil {
		return nil, err
	}

	return &Family{
		SubscriptionID: subID,
		FriendID:       p.FriendID,
	}, nil
}
