import { Text, clx } from "@medusajs/ui"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
  complete?: boolean
  active?: boolean
  triggerable?: boolean
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionPrimitive.AccordionSingleProps &
      React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
      React.RefAttributes<HTMLDivElement>)

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  triggerable,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clx(
        "border-t border-[#e8e8e8] last:border-b py-3.5 group",
        className
      )}
    >
      <AccordionPrimitive.Header className="px-0">
        <AccordionPrimitive.Trigger className="w-full flex items-center justify-between text-left py-1 group focus:outline-none">
          <span className="text-sm font-normal text-[#1a1a1a] tracking-wide group-hover:text-black transition-colors">
            {title}
          </span>
          {customTrigger || <MorphingTrigger />}
        </AccordionPrimitive.Trigger>
        {subtitle && (
          <Text as="span" size="small" className="mt-1 text-[#888]">
            {subtitle}
          </Text>
        )}
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className={clx(
          "radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open radix-state-closed:pointer-events-none overflow-hidden transition-all"
        )}
      >
        <div className="pt-2 pb-3 text-sm text-[#555555] font-light leading-relaxed">
          {description && <p className="mb-2">{description}</p>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => {
  return (
    <div className="flex items-center justify-center w-6 h-6 text-[#1a1a1a]">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="transition-transform duration-200"
      >
        {/* Horizontal line */}
        <line
          x1="1"
          y1="6"
          x2="11"
          y2="6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Vertical line (hides on open) */}
        <line
          x1="6"
          y1="1"
          x2="6"
          y2="11"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="group-radix-state-open:opacity-0 transition-opacity duration-200"
        />
      </svg>
    </div>
  )
}

export default Accordion
