# scramble-numbers

Kommandozeilen-Tools, die den sichtbaren Text im `<body>` von HTML-Dateien unkenntlich machen, z. B. um echte Kennzahlen und Inhalte in Demo- oder Präsentationsversionen eines Berichts zu verbergen.

| Befehl | Zahlen | Buchstaben |
|---|---|---|
| `scramble-numbers` | ✓ | – |
| `scramble-text` | – | ✓ |
| `scramble-publication` | ✓ | ✓ |

**Zahlen**

- Keine Zahl bleibt gleich.
- Ein Teil der Zahlen bekommt zufällig eine Stelle mehr oder weniger, aus `843` wird also z. B. `2432` oder `24`.
- Trennzeichen bleiben stehen, nur die Ziffern dazwischen ändern sich (`1.234,56` → `4.636,26`).

**Buchstaben**

- Jeder Buchstabe wird durch einen zufälligen anderen ersetzt, Groß- und Kleinschreibung bleibt erhalten (`Umsatz` → `Kpwrfe`).
- Wortlängen, Leerzeichen und Satzzeichen bleiben, der Textfluss und Umbrüche sehen also ähnlich aus.
- Umlaute und andere Sonderbuchstaben werden zu einfachen Buchstaben `a`–`z` bzw. `A`–`Z`.

**Für alle Befehle**

- Tags, Attribute (`src`, `width`, `class`, `alt` …), Entities (`&nbsp;`, `&#160;`), `<head>`, `<script>`, `<style>`, `<textarea>` und Kommentare bleiben unverändert, das Layout bleibt also intakt.
- Der Befehl arbeitet immer relativ zum Ordner, in dem er ausgeführt wird.

## Voraussetzungen

| | macOS | Linux / Windows (WSL 2) |
|---|---|---|
| **Node.js** ≥ 20 | ✓ | ✓ |
| **bash**, **git** | vorinstalliert | vorinstalliert |

Keine npm-Abhängigkeiten.

```bash
node --version
```

## Installation

### 1. Repository klonen

```bash
git clone https://github.com/multivisio/scramble-numbers.git ~/scramble-numbers
```

Der Ort ist frei wählbar.

### 2. Befehle in den PATH legen

```bash
~/scramble-numbers/install.sh
```

Das Script prüft die Node-Version und verlinkt `scramble-numbers`, `scramble-text` und `scramble-publication` aus `bin/` nach `~/.local/bin/`. Ist `~/.local/bin` nicht im PATH, gibt es den passenden Befehl aus.

Manuell geht es genauso:

```bash
mkdir -p ~/.local/bin && for c in numbers text publication; do ln -sf ~/scramble-numbers/bin/scramble-$c ~/.local/bin/scramble-$c; done
```

`~/.local/bin` in den PATH eintragen (falls nötig) und ein neues Terminal öffnen.

**macOS** (Standard-Shell ist zsh):

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

**Linux / WSL** (bash):

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

Prüfen:

```bash
scramble-publication --version
```

**Alternative mit npm:** `npm install -g github:multivisio/scramble-numbers`. Mit nvm muss das allerdings für jede Node-Version neu installiert werden, der Symlink oben gilt dagegen für alle.

### Aktualisieren

```bash
git -C ~/scramble-numbers pull
```

Die Symlinks zeigen auf das Repository, ein erneutes Installieren ist nicht nötig. Nur wer von einer Version vor 1.2.0 kommt, muss `install.sh` einmal neu ausführen, damit `scramble-text` und `scramble-publication` verlinkt werden.

## Nutzung

Im Ordner mit den HTML-Dateien ausführen:

```bash
scramble-publication
```

Alle drei Befehle haben dieselben Argumente und Optionen, die Beispiele unten gelten also genauso für `scramble-text` und `scramble-publication`.

Wenn nicht anders angegeben, landet das Ergebnis in **`pdf.html`** im aktuellen Ordner. Das Original bleibt unverändert.

Ohne Angabe einer Datei wird die HTML-Datei im aktuellen Ordner verwendet (`*.html`/`*.htm`, nicht rekursiv). Eine vorhandene `pdf.html` zählt dabei nicht als Eingabe, sie wird überschrieben. Liegen mehrere HTML-Dateien im Ordner, bricht der Befehl ab und listet sie auf: dann eine Datei angeben oder mit `--suffix` bzw. `--in-place` alle verarbeiten.

| Befehl | Ergebnis |
|---|---|
| `scramble-numbers` | die HTML-Datei im aktuellen Ordner → `pdf.html` |
| `scramble-numbers export.html` | `pdf.html` |
| `scramble-numbers export.html -o demo.html` | `demo.html` |
| `scramble-numbers export/ -s _scrambled` | alle HTML-Dateien in `export/` → jeweils `<name>_scrambled.html` daneben |
| `scramble-numbers export/ --in-place` | überschreibt die Dateien in `export/` direkt |

Soll eine vorhandene `pdf.html` selbst verändert werden, geht das nur ausdrücklich: `scramble-numbers pdf.html --in-place` oder `scramble-numbers pdf.html -o <andere-datei>`.

### Optionen

| Option | Bedeutung |
|---|---|
| `-o`, `--output <datei>` | Ausgabedatei (Standard: `pdf.html`, nur bei einer einzelnen Eingabedatei) |
| `-i`, `--in-place` | Eingabedateien direkt überschreiben |
| `-s`, `--suffix <text>` | statt `pdf.html` je eine Kopie `<name><text>.html` neben jede Eingabedatei schreiben |
| `-r`, `--rate <0–1>` | Anteil der Zahlen, die eine Stelle mehr oder weniger bekommen (Standard: `0.3`, nicht bei `scramble-text`) |
| `-h`, `--help` | Hilfe |
| `-v`, `--version` | Version |

## Grenzen

- Jahreszahlen und Datumsangaben im Text werden ebenfalls verändert.
- Bei formatierten Zahlen wird jeder Ziffernblock einzeln verändert. Mit hoher `--rate` kann so z. B. `43.5083,6` entstehen.
- Zahlen und Texte in Attributen (z. B. `alt`- oder `title`-Texte) bleiben bewusst unverändert.
- Der `<title>` im `<head>` bleibt ebenfalls lesbar.

## Entwicklung

```bash
npm test
```

## Lizenz

[MIT](LICENSE)
