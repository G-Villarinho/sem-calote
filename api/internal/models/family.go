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
	FriendIDs []uuid.UUID `json:"friend_ids" validate:"required,gt=0,dive,uuid"`
}

func (p *CreateFamilyPayload) ToFamilies(subscriptionID string) ([]*Family, error) {
	subID, err := uuid.Parse(subscriptionID)
	if err != nil {
		return nil, err
	}

	var families []*Family
	for _, friendID := range p.FriendIDs {
		family := &Family{
			SubscriptionID: subID,
			FriendID:       friendID,
		}
		families = append(families, family)
	}

	return families, nil
}
