import React from 'react'
import DateCalendar from '../../components/UIElements/date/DateCalendar'
import DateFull from '../../components/UIElements/date/DateFull'
export default function MyRequests() {
    return (
        <div>
            <p>Hello from My Requests</p>
            <DateCalendar></DateCalendar>
            <DateFull width="120px"></DateFull>
        </div>
    )
}
