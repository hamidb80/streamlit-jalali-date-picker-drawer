from typing import Tuple
import os, re

import streamlit.components.v1 as components


# config --------------------------------------

pkg_name = "jalali-date-picker-drawer"
dev_server = os.getenv('JALALI_DATA_PICKER_DEV_SERVER') # e.g. "http://localhost:3001"

if dev_server:
    print(f"---- {pkg_name} debug mode ------")
    print(f"---- server: {dev_server}")
    component_fn = components.declare_component(pkg_name, url=dev_server)

else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "jdatepick")
    component_fn = components.declare_component(pkg_name, path=build_dir)

# component --------------------------------------

def extract_numbers(string_containing_numbers):
    return [
        int(d) for d in  
        re.findall("\\d+", string_containing_numbers)
    ]


def jalali_date_picker_drawer(
        default: str, 
        start: str, 
        end: str, 
        joiner: str = '/',
        show_when: str = 'hover',
        close_on_select_day: bool = True, 
        key=None
):
    """
    select from 1402-7-3 to 1407-11-2 with default day of 1403-6-10 

    `show_when` can be 'hover' or 'click'

    date = jalali_date_picker_drawer(
        "1402-07-3" , 
        "1407-11-2", 
        "1403-06-10",
    )
    """

    ret_val = component_fn(
        selected= extract_numbers(default),
        start   = extract_numbers(start), 
        end     = extract_numbers(end), 
        
        joiner  = joiner,
        show_when = show_when,
        
        close_on_select_day = close_on_select_day,

        key=key, 
        default=extract_numbers(default))

    return f"{ret_val[0]}{joiner}{ret_val[1]:02}{joiner}{ret_val[2]:02}"
