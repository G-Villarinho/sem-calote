# Makefile adaptado para SQLite

# --- Variáveis ---

# Define o nome do arquivo do banco de dados SQLite.
# Pode ser facilmente sobrescrito na linha de comando. Ex: make migrate-up DB_FILE=meu_app.db
DB_FILE := dividas.db

# Define a URL de conexão para o SQLite, usada pela ferramenta 'migrate'.
# O formato é sqlite3://<caminho_do_arquivo>
DATABASE_URL := sqlite3://$(DB_FILE)

MIGRATIONS_PATH := infra/migrations

# --- Comandos de Migração ---

.PHONY: migrate-create
migrate-create: ## Cria um novo arquivo de migração. Ex: make migrate-create name=create_users_table
	@echo "Criando migração: $(name)"
	@migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $(name)

.PHONY: migrate-up
migrate-up: ## Aplica todas as migrações pendentes no banco de dados SQLite
	@echo "Aplicando migrações (up) em $(DB_FILE)..."
	@migrate -database "$(DATABASE_URL)" -path $(MIGRATIONS_PATH) up

.PHONY: migrate-down
migrate-down: ## Reverte a última migração aplicada no banco de dados SQLite
	@echo "Revertendo migração (down) em $(DB_FILE)..."
	@migrate -database "$(DATABASE_URL)" -path $(MIGRATIONS_PATH) down

# --- Ajuda ---

.PHONY: help
help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help