import { useEffect, useState } from "react";
import { AnalyticsResponse } from "./analytics-types";
import analyticsService from "./analytics-service";
import html2PDF from "jspdf-html2canvas";
import DatePicker from "./date-picker";
import AnalyticsGraph from "./graph";
import { convertArray } from "./convert-array";

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsResponse>();

    const extraDate = new Date();
    extraDate.setDate(extraDate.getDate() - 20)
    const [startDate, setStartDate] = useState<Date>(extraDate);
    const [endDate , setEndDate] = useState<Date>(new Date());

    const getData = async () => {
        const result = await analyticsService.calculateAmount(startDate, endDate);
        setData({...result.result});
    }

    const handleDateChange = (newValue: {startDate: Date, endDate: Date}) => {
        setStartDate(newValue.startDate);
        setEndDate(newValue.endDate);
    }

    const generatePdf = async () => {
        const page = document.getElementById("results");
        const buttons = page?.querySelectorAll("button");
        buttons?.forEach((button: HTMLButtonElement) => {
            button.remove()
        })
        await html2PDF(page!, {
            jsPDF: {
              format: "a4",
            },
            imageType: "image/jpeg",
            output: "./pdf/generate.pdf",
          });
        window.location.reload();
      };

    useEffect(() => { getData() }, [startDate, endDate]);

    if(data) return <div className="flex w-full p-6 justify-center">
        <div className="flex flex-col gap-4">
            <div>
                <DatePicker className="flex gap-2 w-full justify-center" value={{startDate, endDate}} handleChange={handleDateChange}/>
            </div>
            <div id = "results" className="flex flex-col gap-4 p-4">
                <div>
                    <div className="flex justify-center text-xl p-6">кількість створених замовлень на день</div>
                    <AnalyticsGraph data={convertArray(data.amount)} name="кількість"/>
                </div>
                <div>
                    <div className="flex justify-center text-xl p-6">кількість отриманих замовлень за увесь час</div>
                    <AnalyticsGraph data={convertArray(data.doneAmount)} name="кількість"/>
                </div>
                <div className="flex justify-center p-6">
                    <button className="bg-blue-600 hover:bg-blue-500 py-2 px-4 text-white rounded" type="button" onClick={generatePdf}>Завантажити звіт</button>
                </div>
            </div>
        </div>
    </div>
    else return <div></div>
}