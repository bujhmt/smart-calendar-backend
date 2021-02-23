import { validate, ValidationError } from 'class-validator'

function parseErrors(errors: ValidationError[]): string[] {
    let errorsList: string[] = []
    errors.forEach((error) => {
        errorsList = errorsList.concat(Object.values(error.constraints))
    })
    return errorsList
}

export async function customValidate(target: any): Promise<string[]> {
    const results = await validate(target)
    return parseErrors(results)
}
