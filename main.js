// Przygotuj formularz zapisujący do pliku XLS, ewentualnie CSV na serwerze FTP - preferowany jest format XLS. Użytkownik musi podać imię, nazwisko, mail, link do social mediów, 2/3 zdania o sobie.
// Ograniczenia
// - wszystkie pola muszą być obowiązkowe.
// - pole imię oraz pole nazwisko nie mogą zawierać cyfr, ale mogą zawierać pauzę oddzielającą nazwiska dwuczłonowe
// - pole mail musi się walidować wg formatu mail@domena.com
// - każde wypełnienie formularza musi dopisywać nowy wiersz do istniejącego pliku na serwerze
// - uwzględnij walidację, jeśli formularz zostanie źle wypełniony musi wskazać, które pole i dlaczego jest błędne. Przykład: jeśli w imieniu wpiszę "Jan III" formularz przy próbie akceptacji powinien podać komunikat "Pole imię może zawierać tylko litery"
// - dodaj pole akceptacji Polityki Prywatności

const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const mail = document.getElementById("mail");
const url = document.getElementById("link");
const introduction = document.getElementById("introduction");
const privacy = document.getElementById("privacy");
const form = document.getElementById("form");
const errorElement = document.getElementById("error");

re = /^[a-zA-Z-]*$/;

form.addEventListener("submit", (e) => {
    let messages = [];

    // większość tych walidacji można zrobić bezpośrednio w html
    if (!re.test(fname.value)) {
        messages.push("First name must contain only letters and dashes");
    }

    if (!re.test(lname.value)) {
        messages.push("Last name must contain only letters and dashes");
    }

    if (
        mail.value === null ||
        mail.value === "" ||
        fname.value === null ||
        fname.value === "" ||
        lname.value === null ||
        lname.value === "" ||
        url.value === null ||
        url.value === "" ||
        introduction.value === null ||
        introduction.value === ""
    ) {
        messages.push("Please fill in all fields");
    }

    if (!privacy.checked) {
        messages.push("Accept privacy policy");
    }

    if (messages.length > 0) {
        messages.push("please try again");
        e.preventDefault();
        errorElement.innerText = messages.join(". ");
    } else {
        addToWorksheet(
            fname.value,
            lname.value,
            mail.value,
            url.value,
            introduction.value
        );
    }
});

const addToWorksheet = () => {
    const workbook = XLSX.read("KGK.xlsx");

    //konwersja do json
    let worksheets = {};
    for (const sheetName of workbook.SheetNames) {
        worksheets[sheetName] = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
        );
    }

    // dodanie nowego wiersza
    worksheets.Sheet1.push({
        "First Name": fname.value,
        "Last Name": lname.value,
        Mail: mail.value,
        Link: url.value,
        Introduction: introduction.value,
    });

    // aktualizacja pliku (w rzeczywistości - ze względu na środowisko przeglądarkowe - powoduje to pobranie nowego pliku)
    XLSX.utils.sheet_add_json(workbook.Sheets["Sheet1"], worksheets.Sheet1);
    XLSX.writeFile(workbook, "KGK.xlsx");
};
