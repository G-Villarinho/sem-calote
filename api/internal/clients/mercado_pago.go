package clients

import (
	"context"
	"errors"
	"fmt"

	"github.com/g-villarinho/sem-calote/api/config"
	mercadoPagoConfig "github.com/mercadopago/sdk-go/pkg/config"
	"github.com/mercadopago/sdk-go/pkg/preference"
)

type MercadoPagoGatewayClient struct {
	preferenceClient preference.Client
}

func NewMercadoPagoGatewayClient() (PaymentGatewayClient, error) {

	cfg, err := mercadoPagoConfig.New(config.Env.MercadoPago.AccessToken)
	if err != nil {
		return nil, err
	}

	client := preference.NewClient(cfg)

	return &MercadoPagoGatewayClient{
		preferenceClient: client,
	}, nil
}

func (m *MercadoPagoGatewayClient) CreatePaymentLink(ctx context.Context, input CreatePaymentLinkInput) (string, error) {
	fmt.Println(config.Env.MercadoPago.AccessToken)

	request := preference.Request{
		Items: []preference.ItemRequest{
			{
				Title:      input.Title,
				Quantity:   1,
				UnitPrice:  input.UnitPrice,
				CurrencyID: "BRL",
			},
		},
		BackURLs: &preference.BackURLsRequest{
			Success: config.Env.MercadoPago.SuccessBackURL,
			Pending: config.Env.MercadoPago.FailureBackURL,
			Failure: config.Env.MercadoPago.FailureBackURL,
		},

		AutoReturn: "approved",
	}

	response, err := m.preferenceClient.Create(ctx, request)
	if err != nil {
		return "", err
	}

	if response.SandboxInitPoint == "" {
		return "", errors.New("the Mercado Pago did not return a sandbox payment link")
	}

	return response.SandboxInitPoint, nil
}
