<script>

    import CameraConnection from "../../../lib/CameraSvelteComponents/CameraConnection.svelte";
    import { CameraConnectionType } from "../../../lib/CameraSvelteComponents/CameraConnectionType";

</script>
<div class="flex h-full max-xl:h-[89vh]">
    <div class="flex flex-col justify-start mb-auto">
        <div class="p-4 pr-0 pt-0">
            <div class="object-fit w-32 h-32 place-items-center">
                <img src="https://placehold.co/400x400" alt="">
            </div>
        </div>
        <div class="p-4 pr-0 pt-0">
            <div class="object-fit w-32 h-32 place-items-center">
                <img src="https://placehold.co/400x400" alt="">
            </div>
        </div>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="w-full p-4 pl-0 overflow-y-scroll">
        <div class="object-fit place-items-center">
            <img src="https://placehold.co/400x400" alt="">
        </div>
        <div class="divider"></div>
    </div>
</div>