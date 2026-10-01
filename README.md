# Overlay Controller for OBS

Free, local, ad-free overlay controller designed to work with OBS Studio. It includes animated name lower thirds and a three-network social overlay, controlled from a Custom Browser Dock.

## Features

- English by default, with Brazilian Portuguese available in Settings
- Editable people, roles, and Instagram handles
- Editable YouTube, Facebook, and Instagram labels
- Animated overlays with automatic exit
- Custom colors, font, width, position, and duration
- Import/export JSON configuration
- Automatic local OBS WebSocket connection
- Responsive OBS dock (recommended width: 380 px or more)
- No external icon files required; social icons are embedded in the overlays

## Install

1. Extract this folder to a permanent location.
2. In OBS Studio, enable the WebSocket server on port `4455`. This release expects authentication to be disabled for local-only use.
3. Add `controller.html` as a Custom Browser Dock using a `file:///...` URL.
4. Add `name-overlay.html` as a Browser Source at `1920×250`.
5. Add `social-overlay.html` as a Browser Source at `1920×250`.
6. Keep both Browser Sources visible. They remain transparent until triggered.

## Language

English is the default language for a fresh installation. Brazilian Portuguese can be selected in **Settings > Language**.

## Themes and backgrounds

Settings are grouped into collapsible modules. Click a module heading to open or close it, or use **Expand all / Collapse all**. The dock remembers open modules locally; folding preserves unsaved edits. **Save settings** remains accessible while scrolling.

Open **Settings > Themes & background**. Choose Classic, Midnight, Minimal or Light, then customize the card background (solid, gradient, transparent or image), text colors, decorative accent, opacity, corners and animated shine. Both overlays use the same appearance. Opacity affects only the background, keeping text readable.

PNG, JPEG and WebP backgrounds up to 1 MB are embedded locally and included in JSON exports. “Cover” fills and crops the image; “Contain” shows the whole image over the selected background color. Transparent mode removes the card surface; the OBS scene remains visible outside the cards in every mode.

The live preview works without OBS and uses the first saved person and your social labels. Changes are applied to OBS on the next trigger after **Save settings**. Existing backups remain compatible. Keep `themes.js`, `themes.css`, `theme-editor.js` and `settings-modules.js` beside the three HTML files; reload the dock and browser sources after updating.

By default, the presenter name matches the lower card: equal width, background, text color, corners, shine and decorative accents. Existing configurations also adopt this default. Choose **Presenter style > Custom** to use an independent opaque background and text color. In the default matching mode, background transparency and opacity apply to both panels.

Browser regression checks: with Playwright installed and Microsoft Edge available, run `node test-themes.cjs`. Set `TEST_BROWSER=chrome` to use Chrome instead.

## Code formatting

Source files use two-space indentation, UTF-8 and LF line endings. Keep readable, unminified source in the repository. Format with `npx --yes prettier@3.6.2 --write .` and verify before committing with `npx --yes prettier@3.6.2 --check .`. The shared rules live in `.prettierrc.json`, `.editorconfig` and `.gitattributes`.

## Security

OBS Studio recommends WebSocket authentication in general. This project currently uses an unauthenticated, localhost-oriented setup for zero-friction local operation. Do not expose port `4455` to the Internet, and restrict access with your firewall when appropriate.

## Trademark notice

OBS® and OBS Studio® are trademarks of Wizards of OBS LLC. This independent project is not affiliated with, sponsored by, or endorsed by the OBS Project or Wizards of OBS LLC.

---

## Português (Brasil)

**Overlay Controller for OBS** é um controlador gratuito, local e sem anúncios, desenvolvido para funcionar com o OBS Studio. Inclui lower thirds animados para nomes e um overlay com três redes sociais, controlados por um Custom Browser Dock.

### Recursos

- Inglês como idioma padrão, com português do Brasil disponível nas configurações
- Pessoas, cargos e Instagram editáveis
- YouTube, Facebook e Instagram editáveis
- Overlays animados com saída automática
- Cores, fonte, largura, posição e duração configuráveis
- Importação/exportação da configuração em JSON
- Conexão automática local com OBS WebSocket
- Dock responsivo (largura recomendada: 380 px ou mais)

### Instalação

1. Extraia a pasta em um local permanente.
2. No OBS Studio, ative o servidor WebSocket na porta `4455`. Esta versão espera autenticação desativada para uso exclusivamente local.
3. Adicione `controller.html` como Custom Browser Dock usando uma URL `file:///...`.
4. Adicione `name-overlay.html` como Browser Source em `1920×250`.
5. Adicione `social-overlay.html` como Browser Source em `1920×250`.
6. Mantenha as duas fontes visíveis. Elas permanecem transparentes até serem acionadas.

### Aviso de marca

OBS® e OBS Studio® são marcas registradas da Wizards of OBS LLC. Este é um projeto independente e não possui afiliação, patrocínio ou endosso do OBS Project ou da Wizards of OBS LLC.

### Temas e personalização

As configurações estão organizadas em módulos recolhíveis. Clique no título para abrir ou fechar, ou use **Expandir tudo / Recolher tudo**. O dock lembra quais módulos ficaram abertos; recolher não descarta alterações em edição. **Salvar configurações** permanece acessível durante a rolagem.

Por padrão, o nome do pregador acompanha o cartão inferior: mesma largura, fundo, cor do texto, cantos, brilho e detalhes laterais. Configurações existentes também recebem esse padrão. Em **Estilo do nome do pregador > Personalizado**, é possível usar fundo sólido opaco e cor de texto independentes. No modo padrão, a transparência e a opacidade do fundo valem para os dois cartões.

Em **Configurações (⚙) > Temas e fundo**, escolha Clássico, Noturno, Minimalista ou Claro. Ajuste fundo sólido, degradê, transparente ou imagem, cores dos textos, detalhes do cartão, opacidade, cantos e brilho. O estilo é compartilhado pelos nomes e pelas redes sociais; a opacidade altera somente o fundo.

Imagens PNG, JPEG e WebP de até 1 MB ficam salvas localmente e acompanham o backup JSON. **Preencher** ocupa o cartão com recorte; **Conter** mostra a imagem inteira sobre a cor de fundo escolhida. O restante da fonte continua transparente sobre a cena do OBS.

A prévia usa a primeira pessoa cadastrada e os textos das redes, sem precisar de conexão com o OBS. Clique em **Salvar configurações** para aplicar no próximo acionamento. Backups antigos continuam compatíveis. Mantenha os arquivos `themes.js`, `themes.css`, `theme-editor.js` e `settings-modules.js` junto dos HTMLs e recarregue o dock e as fontes após atualizar.
