<?php

namespace App\sidebar;


final class SidebarEntry
{
    /** @var SidebarEntry[] */
    private array $children = [];

    private string $url = "";
    private string $target = "";
    private string $tooltip = "";
    private int $order = 0;
    private string $name;
    private string $icon = "";
    private bool $collapsed = true;

    public function __construct(string $name, ?string $url = "")
    {
        $this->name = ucwords($name);
        $this->url = $url;
    }

    public function addChildren(
        string $name,
        ?string $url = ""
    ): self {
        $child = new self($name, $url);

        $this->children[] = $child;

        return $child;
    }

    /** @return SidebarEntry[] */
    public function getChildren(): array
    {
        return $this->children;
    }

    public function hasChildren(): bool
    {
        return !empty($this->children);
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function getTarget(): string
    {
        return $this->target;
    }

    public function getTooltip(): string
    {
        return $this->tooltip;
    }

    public function getOrder(): int
    {
        return $this->order;
    }

    public function name(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;
        return $this;
    }

    public function url(string $url): self
    {
        $this->url = $url;
        return $this;
    }

    public function tooltip(string $tooltip): self
    {
        $this->tooltip = $tooltip;
        return $this;
    }

    public function order(int $order): self
    {
        $this->order = $order;
        return $this;
    }

    public function collapsed(bool $is): self
    {
        $this->collapsed = $is;
        return $this;
    }

    public function getCollapsed(): string
    {
        return $this->collapsed ? '' : 'active';
    }
}
