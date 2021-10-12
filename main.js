const getSubwayStations = async () => {
    const url = 'https://private-fcfe0-santandercoders809.apiary-mock.com/stations'
    const response = await fetch(url)
    const data = await response.json()
    const { estacoes } = data
    const { estacao } = estacoes
    return estacao
}

// Troca o nome das linhas "subwayLine1" e "subwayLine2" para "subwayLine". Com isso, todas as estações das 
// linhas "subwayLine1" e "subwayLine2" passam a pertencer à linha "subwayLine".
const groupSubwayLines = (allSubwayStations, subwayLinesToBeGrouped, subwayLine) => {
    const [ subwayLine1, subwayLine2 ] = [ ...subwayLinesToBeGrouped ]
    return allSubwayStations.reduce((acc, subwayStation) => {
        const { _linha } = subwayStation
        if (_linha === subwayLine1 || _linha === subwayLine2 ) {
            subwayStation._linha = subwayLine
            acc.push(subwayStation)
        } else {
            acc.push(subwayStation)
        }
        return acc
    }, [])
}

// Procura pelo índice da estação "repeatedSubwayStation" e atribui à "foundIndex".
// Sempre o índice da última repetição vai ser pegado. Após isso, através do índice encontrado,
// a estação repetida vai ser retirada do array "allSubwayStations".
const removeRepeatedSubwayStation = (allSubwayStations, subwayLine, repeatedSubwayStation) => {
    let foundIndex = null
    allSubwayStations.forEach((subwayStation, index) => {
        const { _linha, _nome } = subwayStation
        if (_linha === subwayLine && _nome === repeatedSubwayStation) foundIndex = index
    })
    allSubwayStations.splice(foundIndex, 1)
    return allSubwayStations
}

const groupSubwayStationsBySubwayLines = allSubwayStations => {
    return allSubwayStations.reduce((acc, subwayStation) => {
        const { _linha } = subwayStation
        acc[_linha] = acc[_linha] || []
        acc[_linha].push(subwayStation)
        return { ...acc }
    }, [])
}

const main = async () => {
    const allSubwayStations = await getSubwayStations()
    const coralSubwayLinesToBeGrouped = ['11-Coral (Guaianazes-Estudantes)', '11-Coral-Expresso Leste (Luz-Guaianazes)']
    const jadeSubwayLinesToBeGrouped = ['13-Jade Serviço Conect', '13-Jade-Airport Express']
    const allSubwayStationsWithGroupedCoralSubwayLines = groupSubwayLines(allSubwayStations, coralSubwayLinesToBeGrouped, '11-Coral')
    const allSubwayStationsWithGroupedJadeSubwayLines = groupSubwayLines(allSubwayStationsWithGroupedCoralSubwayLines, jadeSubwayLinesToBeGrouped, '13-Jade')
    const allSubwayStationsWithoutRepeatingSubwayStationsBySubwayLines = removeRepeatedSubwayStation(allSubwayStationsWithGroupedJadeSubwayLines, '11-Coral' , 'Guaianazes')
    const subwayStationsGroupByLines = groupSubwayStationsBySubwayLines(allSubwayStationsWithoutRepeatingSubwayStationsBySubwayLines)
    console.log(subwayStationsGroupByLines)
}

main()