<template>
    <header>
        <nav class="navbar bg-body-tertiary fixed-top shadow">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img src="logo.svg" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
                    Bootstrap grid generator
                    <span id="format"></span>
                </a>
                <div>
                    <button class="btn-sm navbar-toggler" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas" aria-controls="offcanvas" aria-expanded="false"
                        aria-label="Toggle menu">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>
        </nav>
    </header>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div>
                Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists,
                etc.
            </div>
            <div class="dropdown mt-3">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Dropdown button
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
