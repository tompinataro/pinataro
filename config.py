import os

DB_PATH = os.getenv(
    "CONTACT_CARDS_DB",
    os.path.expanduser("~/Desktop/QR Codes and Logos/contacts_cards.db")
)