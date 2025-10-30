# pinataro
Personal site and portfolio

## Dynamic redirect links (QR ready)

The Express server now supports dynamic redirects that are useful when pairing a QR code with a stable slug. Edit `redirects.json` at the project root to control the destination for each slug. Example:

```json
{
  "carrie": "/QR-Contacts/Carrie/Carrie.html"
}
```

With the sample configuration above a request to `/r/carrie` (or `/r/CARRIE.`) issues a 302 redirect to `/QR-Contacts/Carrie/Carrie.html`. Update the value whenever you need the QR code to point somewhere else—no code changes required. Relative paths will stay on the same domain; supply a full `https://` URL to redirect externally.
