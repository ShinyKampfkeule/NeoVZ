function changeSelect(selectDepartment) {
  let activeOption = selectDepartment.value
  let selectPosition = document.getElementById('position')
  let options = []
  switch (activeOption) {
    case 'Unternehmensleitung':
      options = ['Abteilung auswählen', 'Geschäftsführung', 'stellv. Geschäftsführung', 'Assistenz', 'Empfang']
      break
    case 'HR':
      options = ['Abteilung auswählen', 'Personalplanung', 'Personalkommunikation', 'Entgeltmanagement']
      break
    case 'IT':
      options = ['Abteilung auswählen', 'Anwendungsentwicklung', 'Systeminformatik', 'Web-Developement']
      break
    case 'Filiale':
      options = ['Abteilung auswählen', 'Filialleitung', 'Verkaufsberatung', 'Ausbildung Einzelhandel']
      break
    default:
      options = ['Abteilung auswählen']
  }
  while (selectPosition.firstChild) {
    selectPosition.removeChild(selectPosition.lastChild)
  }
  let optionElement
  options.map((option) => {
    optionElement = document.createElement('option')
    optionElement.value = option
    optionElement.innerHTML = option
    selectPosition.appendChild(optionElement)
  })
}