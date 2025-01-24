import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

export default function Tips() {
  return (
    <div className='p-10 flex w-full flex-col gap-8 z-50'>

      {/* inputs */}
      <div className='flex flex-col md:flex-row w-full gap-4'>
        <div className='w-full flex flex-col md:flex-row gap-4'>
          <Input className='w-full md:w-1/2' label="Min" labelPlacement="inside" type="number" />
          <Input className='w-full md:w-1/2' label="Max" labelPlacement="inside" type="number"  />
          <Input className='w-full md:w-1/2' label="Games" labelPlacement="inside" type="number" />
        </div>
          <Input className='w-full md:w-1/2' label="Jogador" labelPlacement="inside" type="text" />
        <Button className='bg-[#057EFF] h-[55px] w-full md:w-1/2'>
          Filtrar
        </Button>
      </div>
      

      



    </div>
  )
}