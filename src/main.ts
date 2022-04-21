///*|----------------------------------------------------------------------------------------------------
// *|            This source code is provided under the MIT license      	--
// *|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
// *|                See the project's LICENSE.md for details.                  					--
// *|           Copyright (C) 2022 Wasin W. All rights reserved.            		--
///*|----------------------------------------------------------------------------------------------------

// Testing Node.js Native Fetch API - using TypeScript, Docker and Webpack Project

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk'

const apiURL: string = process.env.BASE_URL || 'https://watasalim.vercel.app'

const latestEndpointURL: string = process.env.LASTEST__API_ENDPOINT || '/api/quotes/latest'
const randomEndpointURL: string = process.env.RANDOM_API_ENDPOINT || '/api/quotes/random'

const sendHTTPRequest = async(url: string)=>{

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        const statusText: string = await response.text()
        throw new Error(`HTTP error!: ${response.status} ${statusText}`);
    }
    //Parse response to JSON
    return await response.json()
}

const main = async() =>{

    console.log('Running Main: Testing Node.js Native Fetch API - using TypeScript, Docker and Webpack Project')

    const argv = yargs(hideBin(process.argv))
    .option('choice', {
        alias: 's',
        choices: ['r','l'],
        demandOption: false,
        default: 'l',
        describe: 'API choice',
        type: 'string'
    })
    .version('1.0.0')
    .example([
        ['$0 --choice=l', '']
    ])
    .parseSync()

    const choice: string = argv.choice

    let url: string = `${apiURL}${latestEndpointURL}`

    if (choice === 'r'){
        url  = `${apiURL}${randomEndpointURL}`
    }else{
        url  = `${apiURL}${latestEndpointURL}`
    }

    try{

        const salimQuote = await sendHTTPRequest(url)
        console.log(JSON.stringify(salimQuote))

        console.log(chalk.yellow.bold(`Salim said ${salimQuote['quote']['body']}`))
        console.log(`Powered by ${salimQuote['quote']['url']}`)

    }catch(error){
        console.log(error)
        process.exit();
    }
}

main()