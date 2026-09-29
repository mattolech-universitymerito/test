Poniżej masz gotowe, kompletne wytyczne dla agenta do pracy w tym repozytorium. Zostały przygotowane tak, aby można je było wkleić do AGENTS.md, promptu dla agenta albo do dokumentacji projektu.

Uwaga: repozytorium nie jest obecnie dostępne przez GitHub API, więc poniższe instrukcje są przygotowane jako kompletna specyfikacja projektowa dla nowych implementacji i mogą zostać użyte niezależnie od bieżącego stanu repo.

Gotowe wytyczne dla agenta:

AGENTS.md / Project instructions

Cel projektu

Stwórz aplikację na macOS do tworzenia i eksportu stopek mailowych w formacie HTML. Aplikacja ma pozwalać użytkownikowi na komponowanie wizualnie atrakcyjnej stopki email poprzez prosty edytor z obsługą przeciągania elementów, modyfikacji treści i wygenerowania finalnego kodu HTML do użycia w klientach poczty.

Zakres funkcjonalności

1. Edytor stopki mailowej
- Aplikacja ma umożliwiać budowanie stopki email w prostym układzie WYSIWYG.
- Użytkownik powinien móc dodawać, usuwać, przesuwać i edytować następujące elementy:
  - tekst
  - linki
  - ikony (np. social media)
  - przyciski / CTA
  - niewidoczne tabele HTML do układania elementów w kolumnach
  - sekcje/warstwy
- Wymagane jest wsparcie drag-and-drop dla elementów w obszarze edycji.

2. Tabele niewidoczne (hidden tables)
- Aplikacja powinna wspierać tworzenie układów tabelarycznych w stopce mailowej, ale z domyślnym ukryciem widocznych obramowań.
- Wewnętrzne tabele mają być używane do budowy kompatybilnych układów w HTML email:
  - np. kolumny z ikonami i tekstem
  - układ 2-kolumnowy / 3-kolumnowy
  - wyrównanie tekstu, ikon i linków
- Tabele powinny mieć:
  - border="0"
  - cellpadding="0"
  - cellspacing="0"
  - width w procentach lub px
  - style inline CSS
  - brak widocznych ramek
- Elementy w tabeli powinny być edytowalne jako niezależne bloki.

3. Tekst
- Użytkownik powinien móc:
  - dodawać paragrafy, nagłówki, podpisy, tekst pomocniczy
  - modyfikować kolor, rozmiar, pogrubienie, kursywę, podkreślenie
  - ustawiać wyrównanie w poziomie i pionie
  - zmieniać czcionkę i rozmiar
- Tekst w stopce powinien być prosty i bezpieczny dla maili HTML.

4. Linki
- Obsługa linków:
  - URL
  - target="_blank" z opcjonalnym rel="noopener noreferrer"
  - stylowanie linków: kolor, podkreślenie, hover (jeśli wspierane w HTML email)
- Linki powinny być przypisywalne do tekstu, ikon i przycisków.

5. Ikony
- Możliwość dodawania ikon społecznościowych i usługowych.
- Ikony mogą być:
  - SVG
  - emoji jako fallback
  - ikony z publicznych bibliotek (np. Font Awesome, Lucide, Google Material Symbols) lub zasobów wektorowych
- Każda ikona powinna być możliwa do:
  - ustawienia rozmiaru
  - dodania linka
  - dodania odstępów
- Ikona nie może zależeć od aktywnego internetu w wygenerowanym HTML, chyba że to jest zamierzone i jasno opisane.
- Jeśli ikony pochodzą z zewnętrznych bibliotek online, aplikacja powinna oferować publicznie dostępny fallback, który działa w przeglądarkach i klientach poczty.

6. Eksport HTML
- Wynikiem końcowym ma być gotowy kod HTML stopki mailowej.
- Kod powinien być:
  - czysty
  - czytelny
  - z wbudowanym stylem inline
  - z kompatybilnością z klientami poczty
- Eksport ma obejmować:
  - pełny html
  - head z meta tags
  - body z gotową stopką
  - style inline dla tabel, tekstu, linków, ikon
  - fallbacki dla przeglądarek i klientów poczty
- Aplikacja powinna umożliwiać:
  - podgląd HTML w czasie rzeczywistym
  - kopiowanie do schowka
  - zapis pliku .html
  - ewentualnie eksport do szablonu

7. Wspierane fonty
- Aplikacja ma wspierać publiczne, dostępne fonty, które działają w różnych przeglądarkach.
- Dozwolone są:
  - system fonts
  - Google Fonts
  - publicznie dostępne czcionki z bezpiecznymi fallbackami
- Zawsze należy stosować listę fallbacków:
  - "Arial, Helvetica, sans-serif"
  - "Verdana, Geneva, sans-serif"
  - "Georgia, serif"
  - "Times New Roman, Times, serif"
  - "Trebuchet MS, sans-serif"
  - "Tahoma, sans-serif"
  - "Segoe UI, Arial, sans-serif"
- Jeżeli używany jest font z Google Fonts:
  - korzystać z importu CSS lub linku do biblioteki
  - dodać fallback chain
  - ustawić font-display: swap
  - zapewnić, że nie będzie to jedyny font
- Wygenerowany HTML musi być kompatybilny z tym, że nie każdy klient mailowy ma ten sam zestaw fontów.

8. Użytkowanie i UX
- Aplikacja ma być prosta i intuicyjna dla użytkownika marketingowego / contentowego.
- Interfejs powinien składać się z:
  - panelu narzędzi po lewej
  - obszaru roboczego po środku
  - panelu właściwości po prawej
  - podglądu HTML / podglądu stopki w czasie rzeczywistym
- Użytkownik powinien widzieć efekty natychmiast.
- Dodawanie elementów powinno być możliwe jednym kliknięciem lub drag-and-drop.

Wymagania techniczne

1. Stack technologiczny
- Preferowany stack:
  - macOS app: Swift + SwiftUI
  - albo Electron
  - albo lokalna web app uruchamiana w macOS z przeglądarki, jeśli repo ma to być prostsze do utrzymania
- Wybór stacku zależy od repo i architektury, ale rozwiązanie musi:
  - być natywne dla macOS
  - wspierać drag-and-drop
  - umożliwiać eksport HTML
  - dać możliwość łatwiejszej przyszłej rozbudowy
- Jeśli repo jest pusty lub nie jest określone środowisko, przyjmij:
  - SwiftUI + lokalny model danych + eksport HTML
  - bez zewnętrznej bazy danych
  - JSON / pliki konfiguracyjne do przechowywania projektów
- W przypadku web app:
  - React + TypeScript + Vite
  - komponenty typu editor canvas
  - prewzgląd HTML

2. Struktura projektu
- Struktura kodu powinna być modularna:
  - app/
  - components/
  - models/
  - editors/
  - export/
  - styles/
  - utils/
  - assets/
  - fonts/
- Oddzielić:
  - logikę modelu stopki
  - logikę edycji
  - logic exportu HTML
  - UI drag-and-drop
  - render preview

3. Model danych
- Każdy element stopki powinien mieć:
  - id
  - type (text, link, icon, table, row, column, button, spacer)
  - x, y, width, height (jeśli układ ma być absolutny)
  - parentId
  - style: color, fontSize, fontFamily, bgColor, padding, margin
  - content
  - href
  - alignment
- Tabela i sekcje powinny być przechowywane jako drzewo elementów.

4. Współpraca z HTML email
- Wygenerowany HTML ma być zoptymalizowany pod maile:
  - używać inline styles
  - unikać złożonych CSS i animacji
  - używać tabel dla układu
  - ograniczać zewnętrzne zależności
  - preferować prostą strukturę
  - dodawać kompatybilne fallbacki
- Kod ma być „safe for email”, czyli nie może polegać wyłącznie na nowoczesnych technologiach CSS.

5. Testowanie
- Aplikacja musi mieć testy funkcjonalne dla:
  - dodawania tekstu
  - tworzenia tabel
  - przesuwania elementów
  - zmiany stylów
  - eksportu HTML
  - fallbacków fontów
- Dodatkowo należy sprawdzić:
  - poprawność wygenerowanego HTML
  - brak niezamykanych tagów
  - poprawność osadzania linków
  - poprawność obsługi ikon

Kryteria akceptacji

Projekt jest uznany za zakończony, jeśli:

- użytkownik może dodać tekst do stopki
- użytkownik może dodać i edytować linki
- użytkownik może dodać ikony i przypisać je do linków
- użytkownik może tworzyć układy tabelaryczne z niewidocznymi ramkami
- elementy można przeciągać i zmieniać kolejność
- użytkownik może modyfikować kolory, czcionki, odstępy, wyrównanie
- wygenerowany wynik to pełny, działający HTML stopki email
- HTML jest kompatybilny z przeglądarkami i klientami poczty
- fonty mają publiczne fallbacki i działają w różnych środowiskach
- eksport działa bez błędów

Zakazane zachowania

- Nie generować „czystego” HTML bez inline styles, jeśli ma to być użyte w klientach poczty.
- Nie używać jedynie zewnętrznych fontów bez fallbacków.
- Nie tworzyć układu wyłącznie zależnego od nowoczesnego CSS Grid/Flex, jeśli ma to być wysyłane mailem.
- Nie tworzyć eksportu z niezamkniętymi tagami lub błędną strukturą tabel.
- Nie ograniczać aplikacji do jednego typu czcionki bez możliwości zmiany.
- Nie tłumić dopuszczalności układów tabelarycznych; tabela ma być centralnym elementem projektu.

Konspekt wykonania dla agenta

1. Zidentyfikuj architekturę repozytorium.
2. Ustal stack techniczny: macOS app lub Electron/web app.
3. Zbuduj prosty model danych stopki.
4. Zaimplementuj podstawowy edytor z panelem narzędzi i obszarem roboczym.
5. Dodaj obsługę drag-and-drop dla elementów.
6. Dodaj komponent tabeli z ukrytym stylem.
7. Dodaj edycję tekstu, linków i ikon.
8. Dodaj eksport HTML z inline CSS i fallbackami fontów.
9. Dodaj podgląd.
10. Przetestuj kompatybilność z mailami i przeglądarkami.
11. Upewnij się, że wygenerowany HTML jest gotowy do użycia w klientach poczty.

Instrukcja dla agentów kodujących

- Zawsze projektuj z myślą o HTML email, nie o stronach internetowych.
- Priorytetem jest wygenerowanie „safe email HTML”, a nie tylko atrakcyjnego UI.
- Znacznie ważniejsza od zaawansowanych efektów jest kompatybilność i przenośność.
- Każdy element musi mieć prosty zestaw stylów inline.
- Ustawiaj fallbacki fontów zawsze.
- Tabele mają być podstawowym narzędziem układu.
- Export ma być prosty do wklejenia do klienta poczty lub do wykorzystania w systemach marketing automation.

Jeśli chcesz, mogę od razu przygotować:
- wersję w formacie AGENTS.md do wklejenia do repo,
- wersję krótszą jako prompt dla Copilot Coding Agent,
- albo wersję techniczną pod konkretny stack (SwiftUI / Electron / React).
