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
