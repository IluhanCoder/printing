import moment from "moment"
import ReactDatePicker from "react-datepicker";

interface LocalParams {
    value: {startDate: Date, endDate: Date} | null,
    handleChange: ({startDate, endDate}: {startDate: Date, endDate: Date}) => void,
    className?: string
}

function DatePicker({handleChange, value, className}: LocalParams) {
    const tempDate = new Date();
    tempDate.setDate((new Date()).getDate() + 10);

    const changeStartDateHandler = (date: Date) => {
        const newValue = new Date(date);
        handleChange({startDate: newValue, endDate: (value) ? value.endDate: tempDate});
    }

    const changeEndDateHandler = (date: Date) => {
        const newValue = new Date(date);
        handleChange({startDate: (value) ? value.startDate : new Date(), endDate: newValue});
    }

    return <div className={className}>
        <div className="flex flex-col gap-1">
            <div>дата початку</div>
            {/* <input type="date" defaultValue={moment((value) ? value.startDate : new Date()).format('YYYY-MM-DD')} onChange={changeStartDateHandler}/> */}
            <ReactDatePicker locale="ua" value={moment((value) ? value.startDate : new Date()).format('YYYY-MM-DD')} onChange={changeStartDateHandler}/>
        </div>
        <div className="flex flex-col gap-1">
            <div>дата кінця</div>
            {/* <input type="date" defaultValue={moment((value) ? value.endDate: tempDate).format('YYYY-MM-DD')} onChange={changeEndDateHandler}/> */}
            <ReactDatePicker locale="ua" value={moment((value) ? value.endDate : new Date()).format('YYYY-MM-DD')} onChange={changeEndDateHandler}/>
        </div>
    </div>
}

export default DatePicker