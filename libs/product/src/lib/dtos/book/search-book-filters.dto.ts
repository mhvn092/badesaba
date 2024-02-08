import { CheckNumber, CheckString, IsYear } from "@lib/shared";

export class SearchBookFiltersDto {
    @CheckString(false,false)
    term:string;

    @CheckNumber(true,false)
    @IsYear()
    publishingYear?:number
}