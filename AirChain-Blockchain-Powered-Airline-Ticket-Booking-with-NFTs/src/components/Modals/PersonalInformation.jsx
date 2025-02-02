import React, { useEffect, useState } from 'react'
import { Input } from "@nextui-org/react";
import { Dropdown } from "@nextui-org/react";

function PersonalInformation({details, setDetails}) {

    const [selected, setSelected] = React.useState(new Set(["Gender"]));

    const selectedValue = React.useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
    );

   

    useEffect(() => {
      setDetails( {...details, gender: selectedValue})
    }, [selectedValue])
    

    return (
        <div className='flex flex-col gap-8 py-6'>
            <Input value={details.fname} onChange={(e) => { setDetails({ ...details, fname: e.target.value }) }} css={{ backgroundColor: "#E0D817" }} labelPlaceholder="First Name" />
            <Input value={details.lname} onChange={(e) => { setDetails({ ...details, lname: e.target.value }) }} css={{ backgroundColor: "#E0D817" }} labelPlaceholder="Last Name" />
            <Input value={details.pno} onChange={(e) => { setDetails({ ...details, pno: e.target.value }) }} css={{ backgroundColor: "#E0D817" }} labelPlaceholder="Passport No" />
            <div className='flex gap-4'>
                <Input value={details.dob} onChange={(e) => { setDetails({ ...details, dob: e.target.value }) }} type='date' label="DOB" />
                <Dropdown>
                    <Dropdown.Button flat css={{ tt: "capitalize", background: "#E0D817", color: "#0F172A" }}>
                        {selectedValue}
                    </Dropdown.Button>
                    <Dropdown.Menu
                        aria-label="Single selection actions"
                        color="#0F172A"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selected}
                        onSelectionChange={setSelected}
                    >
                        <Dropdown.Item textColor="#E0D817" key="Male">Male</Dropdown.Item>
                        <Dropdown.Item textColor="#E0D817" key="Female">Female</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default PersonalInformation