import logEvents from "./logEvents.js"

export const errorHandler = (err, req, res, next) => {
    logEvents(`${ err.name }\t${ err.message }`, `errLog.txt`);
    // console.log(err)
    // res.json({ 'message': err.message })
}

