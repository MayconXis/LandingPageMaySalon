import { motion } from 'framer-motion'
import { easeSilk } from '@/lib/motion'

type MenuIconProps = {
  open: boolean
}

const transition = { duration: 0.45, ease: easeSilk }

/**
 * Hambúrguer de duas linhas que se transforma em X.
 * Sempre nasce no estado "fechado"; com open=true ele anima até o X ao montar.
 */
export function MenuIcon({ open }: MenuIconProps) {
  const state = open ? 'open' : 'closed'

  return (
    <span aria-hidden="true" className="relative block h-6 w-6">
      <motion.span
        className="absolute inset-0 m-auto h-[1.5px] rounded-full bg-current"
        style={{ originX: 0.5, originY: 0.5 }}
        initial="closed"
        animate={state}
        exit="closed"
        variants={{
          closed: { y: -4, rotate: 0, width: 22 },
          open: { y: 0, rotate: 45, width: 22 },
        }}
        transition={transition}
      />
      <motion.span
        className="absolute inset-0 m-auto h-[1.5px] rounded-full bg-current"
        style={{ originX: 0.5, originY: 0.5 }}
        initial="closed"
        animate={state}
        exit="closed"
        variants={{
          closed: { y: 4, x: 3, rotate: 0, width: 16 },
          open: { y: 0, x: 0, rotate: -45, width: 22 },
        }}
        transition={transition}
      />
    </span>
  )
}
