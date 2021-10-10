const getInfoAboutTheSubwayStations = async () => {
    const url = 'https://private-fcfe0-santandercoders809.apiary-mock.com/stations'
    const response = await fetch(url)
    const data = await response.json()
    const { estacoes } = data
    const { estacao } = estacoes
    return estacao
}

// Troca o nome das linhas "13-Jade Serviço Conect" e "13-Jade-Airport Express" para "13-Jade".
// Com isso, todas as estações das linhas "13-Jade Serviço Conect" e "13-Jade-Airport Express"
// passam a pertencer à linha "13-Jade".
const groupTheJadeSubwayLines = allSubwayStations => {
    return allSubwayStations.reduce((acc, subwayStation) => {
        const { _linha } = subwayStation
        if(_linha === '13-Jade Serviço Conect' || _linha === '13-Jade-Airport Express') {
            subwayStation._linha = '13-Jade'
            acc.push(subwayStation)
        } else {
            acc.push(subwayStation)
        }
        return acc
    }, [])
}

const groupTheCoralSubwayLines = allSubwayStations => {
    return allSubwayStations.reduce((acc, subwayStation) => {
        const { _linha } = subwayStation
        if(_linha === '11-Coral (Guaianazes-Estudantes)' || _linha === '11-Coral-Expresso Leste (Luz-Guaianazes)') {
            subwayStation._linha = '11-Coral'
            acc.push(subwayStation)
        } else {
            acc.push(subwayStation)
        }
        return acc
    }, [])
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
    let allSubwayStations = await getInfoAboutTheSubwayStations()
    let foundIndex = null

    allSubwayStations = groupTheJadeSubwayLines(allSubwayStations)
    allSubwayStations = groupTheCoralSubwayLines(allSubwayStations)
    
    // Procura pelo índice da estação "Guaianazes" e atribui à "foundIndex".
    // Neste caso, dois índices são encontrados, já que "Guaianazes" se repete duas vezes. Então o índice
    // da última repetição é atribuído à "foundIndex"
    allSubwayStations.forEach((subwayStation, index) => {
        const { _linha, _nome } = subwayStation
        if(_linha === '11-Coral' && _nome === 'Guaianazes') {
            foundIndex = index
        }
    })

    allSubwayStations.splice(foundIndex, 1)

    const subwayStationsGroupByLines = groupSubwayStationsBySubwayLines(allSubwayStations)
    console.log(subwayStationsGroupByLines)
}

main()